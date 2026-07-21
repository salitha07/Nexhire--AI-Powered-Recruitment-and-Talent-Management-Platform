using Microsoft.EntityFrameworkCore;
using Nexhire.Data;
using Nexhire.DTOs;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nexhire.Services
{
    /// <summary>
    /// Uses Gemini 2.5 Flash (via OpenRouter) to generate tailored interview
    /// preparation suggestions based on the candidate's full profile, the job
    /// requirements, and their existing AI ranking result.
    /// </summary>
    public class InterviewPrepService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public InterviewPrepService(
            AppDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("OpenRouter");
        }

        public async Task<InterviewPrepDto> GeneratePrepAsync(int applicationId)
        {
            // 1. Load application with all related data
            var application = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId)
                ?? throw new InvalidOperationException($"Application {applicationId} not found.");

            var candidate = application.Candidate
                ?? throw new InvalidOperationException("Candidate not found.");

            var job = application.Job
                ?? throw new InvalidOperationException("Job not found.");

            // 2. Load existing AI ranking result if available (provides match score + extracted skills)
            var aiResult = await _context.AIResults
                .FirstOrDefaultAsync(r => r.ApplicationId == applicationId);

            // 3. Build the system prompt
            var systemPrompt =
                "You are an expert technical recruiter AI that helps prepare interviewers. " +
                "Given a candidate profile and job details, generate tailored interview preparation content. " +
                "Respond ONLY with a raw JSON object. No markdown. No explanations outside the JSON.\n\n" +
                "The JSON must have exactly these keys:\n" +
                "\"recommendedMode\": one of \"Online\", \"In-Person\", or \"Phone\" — choose based on role type and candidate context,\n" +
                "\"recommendedDuration\": a string like \"45 minutes\" or \"60 minutes\",\n" +
                "\"rationale\": 2-3 sentences explaining your mode and duration recommendation and overall impression,\n" +
                "\"focusAreas\": array of 3-5 strings — specific skill gaps or topics to probe in the interview,\n" +
                "\"suggestedQuestions\": array of exactly 5 strings — tailored, specific interview questions for this candidate and role. " +
                "Questions must reference the candidate's actual profile (their skills, experience years, or stated background).";

            // 4. Build the user message with all context
            var aiResultSection = aiResult != null
                ? $"## Previous AI Ranking\n" +
                  $"Match Score: {aiResult.MatchScore}/100\n" +
                  $"Recommendation: {aiResult.Recommendation}\n" +
                  $"Skills Extracted by AI: {aiResult.ExtractedSkills}\n\n"
                : "## Previous AI Ranking\nNot yet analyzed.\n\n";

            var userMessage =
                $"## Job Title\n{job.Title}\n\n" +
                $"## Job Type\n{job.Type}\n\n" +
                $"## Job Location\n{job.Location}\n\n" +
                $"## Job Description\n{job.Description}\n\n" +
                $"## Job Requirements\n{job.Requirements}\n\n" +
                aiResultSection +
                $"## Candidate Profile\n" +
                $"Name: {candidate.FullName}\n" +
                $"Education: {application.Education}\n" +
                $"Experience Years: {application.ExperienceYears}\n" +
                $"Skills (self-reported): {application.Skills}\n" +
                $"GitHub: {(string.IsNullOrWhiteSpace(application.GithubUrl) ? "Not provided" : application.GithubUrl)}\n" +
                $"LinkedIn: {(string.IsNullOrWhiteSpace(application.LinkedinUrl) ? "Not provided" : application.LinkedinUrl)}\n" +
                $"Portfolio: {(string.IsNullOrWhiteSpace(application.PortfolioUrl) ? "Not provided" : application.PortfolioUrl)}\n\n" +
                $"Why Suitable:\n{(string.IsNullOrWhiteSpace(application.WhySuitable) ? "Not provided." : application.WhySuitable)}\n\n" +
                $"Cover Letter:\n{(string.IsNullOrWhiteSpace(application.CoverLetter) ? "Not provided." : application.CoverLetter)}\n\n" +
                "Generate interview preparation content for this candidate. Return ONLY the JSON object.";

            // 5. Build OpenRouter request
            var requestBody = new
            {
                model = "google/gemini-2.5-flash",
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user",   content = userMessage  }
                },
                temperature = 0.4,  // Slightly higher for creative question generation
                max_tokens = 2000
            };

            var httpContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            // 6. Call OpenRouter
            var response = await _httpClient.PostAsync("chat/completions", httpContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException(
                    $"OpenRouter returned {(int)response.StatusCode}: {errorBody}"
                );
            }

            var responseBody = await response.Content.ReadAsStringAsync();

            // 7. Extract content from the response envelope
            using var responseDoc = JsonDocument.Parse(responseBody);

            var rawContent = responseDoc
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()
                ?? throw new InvalidOperationException("OpenRouter returned empty response.");

            // Strip markdown fences if the model adds them despite instructions
            var cleanJson = rawContent.Trim();
            if (cleanJson.StartsWith("```"))
            {
                cleanJson = cleanJson
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }

            // 8. Deserialize into our DTO
            var parsed = JsonSerializer.Deserialize<InterviewPrepRaw>(
                cleanJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            ) ?? throw new InvalidOperationException("Failed to deserialize AI interview prep response.");

            return new InterviewPrepDto
            {
                RecommendedMode     = parsed.RecommendedMode     ?? "Online",
                RecommendedDuration = parsed.RecommendedDuration ?? "45 minutes",
                Rationale           = parsed.Rationale           ?? string.Empty,
                FocusAreas          = parsed.FocusAreas          ?? new List<string>(),
                SuggestedQuestions  = parsed.SuggestedQuestions  ?? new List<string>()
            };
        }

        // Internal deserialization model
        private class InterviewPrepRaw
        {
            [JsonPropertyName("recommendedMode")]
            public string? RecommendedMode { get; set; }

            [JsonPropertyName("recommendedDuration")]
            public string? RecommendedDuration { get; set; }

            [JsonPropertyName("rationale")]
            public string? Rationale { get; set; }

            [JsonPropertyName("focusAreas")]
            public List<string>? FocusAreas { get; set; }

            [JsonPropertyName("suggestedQuestions")]
            public List<string>? SuggestedQuestions { get; set; }
        }
    }
}
