using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexhire.DTOs;
using Nexhire.Services;
using System.Security.Claims;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationsService _applicationsService;

        public ApplicationsController(ApplicationsService applicationsService)
        {
            _applicationsService = applicationsService;
        }

        [Authorize(Roles = "candidate")]
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] CreateApplicationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var candidateId = GetCurrentUserId();
            if (candidateId == null)
                return Unauthorized(new { message = "Invalid token." });

            try
            {
                var application = await _applicationsService.ApplyAsync(dto, candidateId.Value);
                return CreatedAtAction(nameof(GetMyApplications), new { }, application);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "candidate")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyApplications()
        {
            var candidateId = GetCurrentUserId();
            if (candidateId == null)
                return Unauthorized(new { message = "Invalid token." });

            var applications = await _applicationsService.GetMyApplicationsAsync(candidateId.Value);
            return Ok(applications);
        }

        [Authorize(Roles = "recruiter")]
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var applications = await _applicationsService.GetApplicationsForJobAsync(jobId, recruiterId.Value);
            if (applications == null)
                return NotFound(new { message = "Job not found or not authorized." });

            return Ok(applications);
        }

        [Authorize(Roles = "recruiter")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            try
            {
                var application = await _applicationsService.UpdateStatusAsync(id, dto, recruiterId.Value);
                if (application == null)
                    return NotFound(new { message = "Application not found or not authorized." });

                return Ok(application);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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