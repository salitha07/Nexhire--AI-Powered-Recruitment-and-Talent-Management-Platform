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
        private readonly AIService _aiService;


        private static readonly string[] ValidStatuses =
        {
            "Applied",
            "Shortlisted",
            "Rejected"
        };


        public ApplicationsService(
            AppDbContext context,
            AIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }



        // =====================================================
        // Candidate applies for a job
        // =====================================================

        public async Task<ApplicationDto> ApplyAsync(
            CreateApplicationDto dto,
            int candidateId)
        {

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == dto.JobId);



            if (job == null)
            {
                throw new InvalidOperationException(
                    "Job not found."
                );
            }



            if (!job.IsActive)
            {
                throw new InvalidOperationException(
                    "This job is no longer accepting applications."
                );
            }



            // Check duplicate application

            var existingApplication =
                await _context.Applications

                .Include(a => a.Job)

                .Include(a => a.Candidate)

                .FirstOrDefaultAsync(a =>
                    a.JobId == dto.JobId &&
                    a.CandidateId == candidateId
                );



            if (existingApplication != null)
            {
                return MapToDto(existingApplication);
            }





            // Create new application

            var application = new Application
            {

                JobId = dto.JobId,

                CandidateId = candidateId,


                Education = dto.Education,

                ExperienceYears = dto.ExperienceYears,

                Skills = dto.Skills,


                GithubUrl = dto.GithubUrl,

                LinkedinUrl = dto.LinkedinUrl,

                PortfolioUrl = dto.PortfolioUrl,


                WhySuitable = dto.WhySuitable,


                ResumePath = dto.ResumePath,


                CoverLetter = dto.CoverLetter,


                Status = "Applied",


                AppliedAt = DateTime.UtcNow

            };





            _context.Applications.Add(application);


            await _context.SaveChangesAsync();




            // =====================================================
            // AI Candidate Matching
            // AI failure should NOT cancel application
            // =====================================================


            try
            {

                await _aiService.RankCandidateAsync(
                    application.Id
                );

            }
            catch (Exception ex)
            {

                Console.WriteLine(
                    "AI Ranking Failed: " + ex.Message
                );

            }





            var savedApplication =
                await _context.Applications

                .Include(a => a.Job)

                .Include(a => a.Candidate)

                .FirstAsync(
                    a => a.Id == application.Id
                );



            return MapToDto(savedApplication);

        }







        // =====================================================
        // Candidate: Get own applications
        // =====================================================


        public async Task<IEnumerable<ApplicationDto>>
            GetMyApplicationsAsync(int candidateId)
        {


            var applications =
                await _context.Applications

                .Include(a => a.Job)

                .Include(a => a.Candidate)

                .Where(a =>
                    a.CandidateId == candidateId
                )

                .OrderByDescending(
                    a => a.AppliedAt
                )

                .ToListAsync();



            return applications.Select(
                MapToDto
            );

        }







        // =====================================================
        // Recruiter: Get applicants for job
        // =====================================================


        public async Task<IEnumerable<ApplicationDto>?>
            GetApplicationsForJobAsync(
                int jobId,
                int recruiterId)
        {


            var job =
                await _context.Jobs

                .FirstOrDefaultAsync(
                    j => j.Id == jobId
                );



            if (job == null ||
               job.PostedById != recruiterId)
            {
                return null;
            }





            var applications =
                await _context.Applications

                .Include(a => a.Job)

                .Include(a => a.Candidate)

                .Where(a =>
                    a.JobId == jobId
                )

                .OrderByDescending(
                    a => a.AppliedAt
                )

                .ToListAsync();




            return applications.Select(
                MapToDto
            );

        }








        // =====================================================
        // Recruiter updates application status
        // =====================================================


        public async Task<ApplicationDto?>
            UpdateStatusAsync(
                int applicationId,
                UpdateApplicationStatusDto dto,
                int recruiterId)
        {



            if (!ValidStatuses.Contains(dto.Status))
            {
                throw new InvalidOperationException(
                    "Invalid status."
                );
            }





            var application =
                await _context.Applications

                .Include(a => a.Job)

                .Include(a => a.Candidate)

                .FirstOrDefaultAsync(
                    a => a.Id == applicationId
                );





            if (application == null)
            {
                return null;
            }





            if (application.Job == null ||
               application.Job.PostedById != recruiterId)
            {
                return null;
            }





            application.Status =
                dto.Status;



            await _context.SaveChangesAsync();




            return MapToDto(application);

        }








        // =====================================================
        // Convert Application Model -> DTO
        // =====================================================


        private static ApplicationDto MapToDto(
            Application application)
        {

            return new ApplicationDto
            {

                Id = application.Id,


                JobId = application.JobId,


                JobTitle =
                    application.Job?.Title
                    ?? string.Empty,


                JobLocation =
                    application.Job?.Location
                    ?? string.Empty,


                JobType =
                    application.Job?.Type
                    ?? string.Empty,




                CandidateId =
                    application.CandidateId,


                CandidateFullName =
                    application.Candidate?.FullName
                    ?? string.Empty,


                CandidateEmail =
                    application.Candidate?.Email
                    ?? string.Empty,




                Education =
                    application.Education,



                ExperienceYears =
                    application.ExperienceYears,



                Skills =
                    application.Skills,



                GithubUrl =
                    application.GithubUrl,



                LinkedinUrl =
                    application.LinkedinUrl,



                PortfolioUrl =
                    application.PortfolioUrl,



                WhySuitable =
                    application.WhySuitable,



                ResumePath =
                    application.ResumePath,



                CoverLetter =
                    application.CoverLetter,



                Status =
                    application.Status,



                AppliedAt =
                    application.AppliedAt

            };

        }

    }
}