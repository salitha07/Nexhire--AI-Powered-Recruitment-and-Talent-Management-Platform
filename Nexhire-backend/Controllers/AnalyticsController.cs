using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nexhire.Data;
using Nexhire.DTOs;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/analytics")]
    [Authorize(Roles = "admin")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/analytics/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = new AnalyticsSummaryDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalCandidates = await _context.Users.CountAsync(u => u.Role == "candidate"),
                TotalRecruiters = await _context.Users.CountAsync(u => u.Role == "recruiter"),
                TotalJobs = await _context.Jobs.CountAsync(),
                OpenJobs = await _context.Jobs.CountAsync(j => j.IsActive),
                TotalApplications = await _context.Applications.CountAsync(),
                TotalHired = await _context.Applications.CountAsync(a => a.Status == "Hired"),
                TotalInterviews = await _context.Interviews.CountAsync()
            };

            return Ok(summary);
        }

        // GET /api/analytics/applications-per-month
        [HttpGet("applications-per-month")]
        public async Task<IActionResult> GetApplicationsPerMonth()
        {
            var data = await _context.Applications
                .GroupBy(a => new { a.AppliedAt.Year, a.AppliedAt.Month })
                .Select(g => new MonthlyStatDto
                {
                    Month = g.Key.Year + "-" + g.Key.Month.ToString("D2"),
                    Count = g.Count()
                })
                .OrderBy(g => g.Month)
                .ToListAsync();

            return Ok(data);
        }

        // GET /api/analytics/jobs-per-status (active vs inactive jobs)
        [HttpGet("jobs-per-status")]
        public async Task<IActionResult> GetJobsPerStatus()
        {
            var data = await _context.Jobs
                .GroupBy(j => j.IsActive)
                .Select(g => new
                {
                    Status = g.Key ? "Active" : "Inactive",
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        // GET /api/analytics/applications-per-status (Applied, Shortlisted, Hired, Rejected etc.)
        [HttpGet("applications-per-status")]
        public async Task<IActionResult> GetApplicationsPerStatus()
        {
            var data = await _context.Applications
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(data);
        }
    }
}