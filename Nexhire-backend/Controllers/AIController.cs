using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexhire.DTOs;
using Nexhire.Services;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]  // All endpoints require a valid JWT
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;

        public AIController(AIService aiService)
        {
            _aiService = aiService;
        }

        /// <summary>
        /// Ranks a candidate against the job they applied for using AI.
        /// Accessible by recruiters (to analyse applicants) and the candidate themselves.
        /// </summary>
        /// <param name="applicationId">ID of the application to analyse</param>
        [Authorize(Roles = "recruiter,candidate,hiring_manager,admin")]
        [HttpPost("rank/{applicationId}")]
        public async Task<IActionResult> RankCandidate(int applicationId)
        {
            try
            {
                var result = await _aiService.RankCandidateAsync(applicationId);

                var dto = new AIResultDto
                {
                    Id              = result.Id,
                    ApplicationId   = result.ApplicationId,
                    MatchScore      = result.MatchScore,
                    ExtractedSkills = result.ExtractedSkills,
                    Recommendation  = result.Recommendation,
                    CreatedAt       = result.CreatedAt
                };

                return Ok(dto);
            }
            catch (InvalidOperationException ex)
            {
                // Thrown by AIService when application / candidate / job not found
                return NotFound(new { message = ex.Message });
            }
            catch (HttpRequestException ex)
            {
                // Thrown when OpenRouter returns a non-2xx response
                return StatusCode(502, new
                {
                    message = "AI provider returned an error. Please try again later.",
                    detail  = ex.Message
                });
            }
            catch (Exception ex)
            {
                // Catch-all: JSON parse failures, unexpected network issues, etc.
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while processing the AI request.",
                    detail  = ex.Message
                });
            }
        }

        /// <summary>
        /// Retrieves the last saved AI result for a given application (no re-analysis).
        /// </summary>
        /// <param name="applicationId">ID of the application</param>
        [Authorize(Roles = "recruiter,candidate,hiring_manager,admin")]
        [HttpGet("result/{applicationId}")]
        public async Task<IActionResult> GetResult(int applicationId)
        {
            try
            {
                var result = await _aiService.GetResultAsync(applicationId);

                if (result == null)
                    return NotFound(new { message = $"No AI result found for application {applicationId}." });

                var dto = new AIResultDto
                {
                    Id              = result.Id,
                    ApplicationId   = result.ApplicationId,
                    MatchScore      = result.MatchScore,
                    ExtractedSkills = result.ExtractedSkills,
                    Recommendation  = result.Recommendation,
                    CreatedAt       = result.CreatedAt
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the AI result.",
                    detail  = ex.Message
                });
            }
        }
    }
}
