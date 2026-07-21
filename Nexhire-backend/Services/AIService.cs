using Microsoft.EntityFrameworkCore;
using Nexhire.Data;
using Nexhire.Models;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nexhire.Services
{
    /// <summary>
    /// Calls OpenRouter (Gemini 2.5 Flash) to rank a candidate against a job description
    /// and persists the AI result to the database.
    /// </summary>
    public class AIService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;


        public AIService(AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("OpenRouter");
        }


        public async Task<AIResult> RankCandidateAsync(int applicationId)
        {
            // 1. Load application with candidate and job

            var application = await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId)
                ?? throw new InvalidOperationException(
                    $"Application {applicationId} not found."
                );


            var candidate = application.Candidate
                ?? throw new InvalidOperationException(
                    "Candidate profile not found."
                );


            var job = application.Job
                ?? throw new InvalidOperationException(
                    "Job details not found."
                );



            // 2. Build AI prompt

            var systemPrompt =
                "You are a senior technical recruiter AI. " +
                "Evaluate how well a candidate matches a job posting. " +
                "Respond ONLY with a raw JSON object. No markdown. " +
                "No explanations outside JSON.\n\n" +

                "The JSON must contain exactly these keys:\n" +

                "\"matchScore\": integer 1-100 representing overall match percentage,\n" +

                "\"extractedSkills\": comma-separated skills found from candidate profile, skills list, resume information and cover letter,\n" +

                "\"recommendation\": one of \"Strong Hire\", \"Hire\", \"Maybe\", \"No Hire\" with one sentence reason.";



            var userMessage =

                $"## Job Title\n{job.Title}\n\n" +

                $"## Job Description\n{job.Description}\n\n" +

                $"## Job Requirements\n{job.Requirements}\n\n" +

                "## Candidate Information\n\n" +

                $"Name: {candidate.FullName}\n\n" +

                $"Education: {application.Education}\n\n" +

                $"Experience Years: {application.ExperienceYears}\n\n" +

                $"Skills: {application.Skills}\n\n" +

                $"GitHub: {application.GithubUrl}\n\n" +

                $"LinkedIn: {application.LinkedinUrl}\n\n" +

                $"Portfolio: {application.PortfolioUrl}\n\n" +

                $"Why Suitable:\n{application.WhySuitable}\n\n" +

                $"Cover Letter:\n" +
                $"{(string.IsNullOrWhiteSpace(application.CoverLetter)
                    ? "Not provided."
                    : application.CoverLetter)}\n\n" +

                "Evaluate this candidate against the job requirements and return ONLY the JSON object.";



            // 3. OpenRouter request

            var requestBody = new
            {
                model = "google/gemini-2.5-flash",

                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = systemPrompt
                    },

                    new
                    {
                        role = "user",
                        content = userMessage
                    }
                },

                temperature = 0.2,

                max_tokens = 300
            };



            var jsonPayload = JsonSerializer.Serialize(requestBody);


            var httpContent = new StringContent(
                jsonPayload,
                Encoding.UTF8,
                "application/json"
            );



            // 4. Call OpenRouter

            var response = await _httpClient.PostAsync(
                "chat/completions",
                httpContent
            );


            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();

                throw new HttpRequestException(
                    $"OpenRouter returned {(int)response.StatusCode}: {errorBody}"
                );
            }



            var responseBody = await response.Content.ReadAsStringAsync();



            // 5. Extract AI response

            using var responseDoc = JsonDocument.Parse(responseBody);


            var rawContent = responseDoc
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()
                ?? throw new InvalidOperationException(
                    "OpenRouter returned an empty response."
                );



            var cleanJson = rawContent.Trim();


            if (cleanJson.StartsWith("```"))
            {
                cleanJson = cleanJson
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }



            // 6. Deserialize AI response

            var aiResponse =
                JsonSerializer.Deserialize<AIRankingResponse>(
                    cleanJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                )
                ?? throw new InvalidOperationException(
                    "Failed to deserialize AI response."
                );



            var matchScore = Math.Clamp(
                aiResponse.MatchScore,
                1,
                100
            );



            // 7. Save AI Result

            var existing = await _context.AIResults
                .FirstOrDefaultAsync(
                    r => r.ApplicationId == applicationId
                );


            AIResult result;


            if (existing != null)
            {
                existing.MatchScore = matchScore;

                existing.ExtractedSkills =
                    aiResponse.ExtractedSkills ?? string.Empty;

                existing.Recommendation =
                    aiResponse.Recommendation ?? string.Empty;

                existing.CreatedAt = DateTime.UtcNow;


                result = existing;
            }
            else
            {
                result = new AIResult
                {
                    ApplicationId = applicationId,

                    MatchScore = matchScore,

                    ExtractedSkills =
                        aiResponse.ExtractedSkills ?? string.Empty,

                    Recommendation =
                        aiResponse.Recommendation ?? string.Empty,

                    CreatedAt = DateTime.UtcNow
                };


                _context.AIResults.Add(result);
            }



            await _context.SaveChangesAsync();


            return result;
        }



        public async Task<AIResult?> GetResultAsync(int applicationId)
        {
            return await _context.AIResults
                .FirstOrDefaultAsync(
                    r => r.ApplicationId == applicationId
                );
        }



        private class AIRankingResponse
        {
            [JsonPropertyName("matchScore")]
            public int MatchScore { get; set; }


            [JsonPropertyName("extractedSkills")]
            public string? ExtractedSkills { get; set; }


            [JsonPropertyName("recommendation")]
            public string? Recommendation { get; set; }
        }
    }
}