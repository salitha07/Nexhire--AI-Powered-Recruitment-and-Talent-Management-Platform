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
    public class InterviewsService
    {
        private readonly AppDbContext _context;

        private static readonly string[] ValidModes = { "Online", "In-Person", "Phone" };
        private static readonly string[] ValidStatuses = { "Scheduled", "Completed", "Cancelled" };

        public InterviewsService(AppDbContext context)
        {
            _context = context;
        }

        // Recruiter schedules an interview for a candidate's application (must own the job)
        public async Task<InterviewDto> ScheduleAsync(CreateInterviewDto dto, int recruiterId)
        {
            if (!ValidModes.Contains(dto.Mode))
            {
                throw new InvalidOperationException("Invalid mode. Must be Online, In-Person, or Phone.");
            }

            if (dto.ScheduledAt <= DateTime.UtcNow)
            {
                throw new InvalidOperationException("Interview time must be in the future.");
            }

            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Candidate)
                .FirstOrDefaultAsync(a => a.Id == dto.ApplicationId);

            if (application == null)
            {
                throw new InvalidOperationException("Application not found.");
            }

            if (application.Job == null || application.Job.PostedById != recruiterId)
            {
                throw new InvalidOperationException("You do not own the job for this application.");
            }

            var interview = new Interview
            {
                ApplicationId = dto.ApplicationId,
                ScheduledById = recruiterId,
                ScheduledAt = dto.ScheduledAt,
                Mode = dto.Mode,
                MeetingLink = dto.MeetingLink,
                Status = "Scheduled",
                CreatedAt = DateTime.UtcNow
            };

            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            interview.Application = application;
            return MapToDto(interview);
        }

        // Candidate: view own interviews (past and upcoming)
        public async Task<IEnumerable<InterviewDto>> GetMyInterviewsAsync(int candidateId)
        {
            var interviews = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .Where(i => i.Application != null && i.Application.CandidateId == candidateId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();

            return interviews.Select(MapToDto);
        }

        // Recruiter: view interviews scheduled for a specific application they own
        public async Task<IEnumerable<InterviewDto>?> GetForApplicationAsync(int applicationId, int recruiterId)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null || application.Job == null || application.Job.PostedById != recruiterId)
            {
                return null;
            }

            var interviews = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .Where(i => i.ApplicationId == applicationId)
                .OrderByDescending(i => i.ScheduledAt)
                .ToListAsync();

            return interviews.Select(MapToDto);
        }

        // Hiring manager: view all interviews, optionally filtered by status
        public async Task<IEnumerable<InterviewDto>> GetAllAsync(string? status)
        {
            var query = _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var interviews = await query
                .OrderBy(i => i.ScheduledAt)
                .ToListAsync();

            return interviews.Select(MapToDto);
        }

        // Recruiter: reschedule or cancel an interview for a job they own
        public async Task<InterviewDto?> UpdateStatusAsync(int id, UpdateInterviewStatusDto dto, int recruiterId)
        {
            if (!ValidStatuses.Contains(dto.Status))
            {
                throw new InvalidOperationException("Invalid status. Must be Scheduled, Completed, or Cancelled.");
            }

            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (interview == null) return null;

            if (interview.Application?.Job == null || interview.Application.Job.PostedById != recruiterId)
            {
                return null;
            }

            if (dto.ScheduledAt.HasValue)
            {
                if (dto.ScheduledAt.Value <= DateTime.UtcNow)
                {
                    throw new InvalidOperationException("Interview time must be in the future.");
                }
                interview.ScheduledAt = dto.ScheduledAt.Value;
            }

            interview.Status = dto.Status;
            await _context.SaveChangesAsync();

            return MapToDto(interview);
        }

        // Hiring manager: submit feedback and score, marks the interview Completed
        public async Task<InterviewDto?> SubmitFeedbackAsync(int id, SubmitFeedbackDto dto)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a!.Job)
                .Include(i => i.Application).ThenInclude(a => a!.Candidate)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (interview == null) return null;

            interview.Feedback = dto.Feedback;
            interview.Score = dto.Score;
            interview.Status = "Completed";

            await _context.SaveChangesAsync();
            return MapToDto(interview);
        }

        // Helper method to map model to DTO
        private static InterviewDto MapToDto(Interview interview)
        {
            return new InterviewDto
            {
                Id = interview.Id,
                ApplicationId = interview.ApplicationId,
                JobId = interview.Application?.JobId ?? 0,
                JobTitle = interview.Application?.Job?.Title ?? string.Empty,
                CandidateId = interview.Application?.CandidateId ?? 0,
                CandidateFullName = interview.Application?.Candidate?.FullName ?? string.Empty,
                CandidateEmail = interview.Application?.Candidate?.Email ?? string.Empty,
                ScheduledAt = interview.ScheduledAt,
                Mode = interview.Mode,
                MeetingLink = interview.MeetingLink,
                Status = interview.Status,
                Feedback = interview.Feedback,
                Score = interview.Score,
                CreatedAt = interview.CreatedAt
            };
        }
    }
}
