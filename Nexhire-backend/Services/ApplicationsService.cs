using Microsoft.EntityFrameworkCore;
using Nexhire.Data;
using Nexhire.DTOs;
using Nexhire.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nexhire.Services
{
    public class ApplicationsService
    {
        private readonly AppDbContext _context;

        // Allowed status values for an application
        private static readonly string[] ValidStatuses = { "Applied", "Shortlisted", "Rejected" };

        public ApplicationsService(AppDbContext context)
        {
            _context = context;
        }

        // Candidate applies to a job
        public async Task<ApplicationDto> ApplyAsync(CreateApplicationDto dto, int candidateId)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == dto.JobId);
            if (job == null)
            {
                throw new InvalidOperationException("Job not found.");
            }

            if (!job.IsActive)
            {
                throw new InvalidOperationException("This job is no longer accepting applications.");
            }

            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.JobId == dto.JobId && a.CandidateId == candidateId);

            if (alreadyApplied)
            {
                throw new InvalidOperationException("You have already applied to this job.");
            }

            var application = new Application
            {
                JobId = dto.JobId,
                CandidateId = candidateId,
                CoverLetter = dto.CoverLetter,
                Status = "Applied",
                AppliedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            var saved = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstAsync(a => a.Id == application.Id);

            return MapToDto(saved);
        }

        // Candidate: view own applications
        public async Task<IEnumerable<ApplicationDto>> GetMyApplicationsAsync(int candidateId)
        {
            var applications = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .Where(a => a.CandidateId == candidateId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return applications.Select(MapToDto);
        }

        // Recruiter: view all applicants for a specific job they own
        public async Task<IEnumerable<ApplicationDto>?> GetApplicationsForJobAsync(int jobId, int recruiterId)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null || job.PostedById != recruiterId)
            {
                return null;
            }

            var applications = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return applications.Select(MapToDto);
        }

        // Recruiter: shortlist or reject an applicant (must own the job)
        public async Task<ApplicationDto?> UpdateStatusAsync(int applicationId, UpdateApplicationStatusDto dto, int recruiterId)
        {
            if (!ValidStatuses.Contains(dto.Status))
            {
                throw new InvalidOperationException("Invalid status. Must be Applied, Shortlisted, or Rejected.");
            }

            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null) return null;

            // Ensure the recruiter owns the job this application belongs to
            if (application.Job == null || application.Job.PostedById != recruiterId) return null;

            application.Status = dto.Status;
            await _context.SaveChangesAsync();

            return MapToDto(application);
        }

        // Helper method to map model to DTO
        private static ApplicationDto MapToDto(Application application)
        {
            return new ApplicationDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? string.Empty,
                JobLocation = application.Job?.Location ?? string.Empty,
                JobType = application.Job?.Type ?? string.Empty,
                CandidateId = application.CandidateId,
                CandidateFullName = application.Candidate?.FullName ?? string.Empty,
                CandidateEmail = application.Candidate?.Email ?? string.Empty,
                CoverLetter = application.CoverLetter,
                Status = application.Status,
                AppliedAt = application.AppliedAt
            };
        }
    }
}