using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexhire.DTOs;
using Nexhire.Services;
using System.Security.Claims;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/interviews")]
    public class InterviewsController : ControllerBase
    {
        private readonly InterviewsService _interviewsService;

        public InterviewsController(InterviewsService interviewsService)
        {
            _interviewsService = interviewsService;
        }

        // Recruiter schedules an interview for an applicant
        [Authorize(Roles = "recruiter")]
        [HttpPost]
        public async Task<IActionResult> Schedule([FromBody] CreateInterviewDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            try
            {
                var interview = await _interviewsService.ScheduleAsync(dto, recruiterId.Value);
                return CreatedAtAction(nameof(GetForApplication), new { applicationId = dto.ApplicationId }, interview);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Candidate: view own interviews
        [Authorize(Roles = "candidate")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyInterviews()
        {
            var candidateId = GetCurrentUserId();
            if (candidateId == null)
                return Unauthorized(new { message = "Invalid token." });

            var interviews = await _interviewsService.GetMyInterviewsAsync(candidateId.Value);
            return Ok(interviews);
        }

        // Recruiter: view interviews scheduled for one of their job's applications
        [Authorize(Roles = "recruiter")]
        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetForApplication(int applicationId)
        {
            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var interviews = await _interviewsService.GetForApplicationAsync(applicationId, recruiterId.Value);
            if (interviews == null)
                return NotFound(new { message = "Application not found or not authorized." });

            return Ok(interviews);
        }

        // Hiring manager: view all interviews, optionally filtered by ?status=Scheduled
        [Authorize(Roles = "hiring_manager")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status)
        {
            var interviews = await _interviewsService.GetAllAsync(status);
            return Ok(interviews);
        }

        // Recruiter: reschedule or cancel an interview
        [Authorize(Roles = "recruiter")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateInterviewStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            try
            {
                var interview = await _interviewsService.UpdateStatusAsync(id, dto, recruiterId.Value);
                if (interview == null)
                    return NotFound(new { message = "Interview not found or not authorized." });

                return Ok(interview);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Hiring manager: submit feedback and score after conducting the interview
        [Authorize(Roles = "hiring_manager")]
        [HttpPut("{id}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int id, [FromBody] SubmitFeedbackDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var interview = await _interviewsService.SubmitFeedbackAsync(id, dto);
            if (interview == null)
                return NotFound(new { message = "Interview not found." });

            return Ok(interview);
        }

        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst("Id")?.Value;
            if (int.TryParse(idClaim, out int userId))
                return userId;
            return null;
        }
    }
}
