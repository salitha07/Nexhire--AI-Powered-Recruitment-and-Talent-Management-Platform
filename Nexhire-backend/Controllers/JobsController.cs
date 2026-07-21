using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexhire.DTOs;
using Nexhire.Services;
using System.Security.Claims;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly JobsService _jobsService;

        public JobsController(JobsService jobsService)
        {
            _jobsService = jobsService;
        }

        // GET: api/jobs?search=developer&type=full-time&location=colombo
        [HttpGet]
        public async Task<IActionResult> GetAllJobs(
            [FromQuery] string? search,
            [FromQuery] string? type,
            [FromQuery] string? location)
        {
            var jobs = await _jobsService.GetAllJobsAsync(search, type, location);
            return Ok(jobs);
        }

        // GET: api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _jobsService.GetJobByIdAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found." });

            return Ok(job);
        }

        // GET: api/jobs/mine  (Recruiter: returns only their own jobs, including inactive)
        [Authorize(Roles = "recruiter")]
        [HttpGet("mine")]
        public async Task<IActionResult> GetMyJobs()
        {
            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var jobs = await _jobsService.GetMyJobsAsync(recruiterId.Value);
            return Ok(jobs);
        }


        // POST: api/jobs  (Recruiter only)
        [Authorize(Roles = "recruiter")]
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var job = await _jobsService.CreateJobAsync(dto, recruiterId.Value);
            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }

        // PUT: api/jobs/{id}  (Recruiter who posted it only)
        [Authorize(Roles = "recruiter")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var job = await _jobsService.UpdateJobAsync(id, dto, recruiterId.Value);
            if (job == null)
                return NotFound(new { message = "Job not found or you are not authorized to update it." });

            return Ok(job);
        }

        // DELETE: api/jobs/{id}  (Recruiter who posted it only)
        [Authorize(Roles = "recruiter")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var recruiterId = GetCurrentUserId();
            if (recruiterId == null)
                return Unauthorized(new { message = "Invalid token." });

            var result = await _jobsService.DeleteJobAsync(id, recruiterId.Value);
            if (!result)
                return NotFound(new { message = "Job not found or you are not authorized to delete it." });

            return Ok(new { message = "Job deleted successfully." });
        }

        // Helper: Extract current logged-in recruiter ID from JWT
        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(idClaim, out int userId))
                return userId;

            return null;
        }
    }
}
