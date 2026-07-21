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
    public class JobsService
    {
        private readonly AppDbContext _context;

        public JobsService(AppDbContext context)
        {
            _context = context;
        }


        // Get all active jobs with search and filters
        public async Task<IEnumerable<JobDto>> GetAllJobsAsync(
            string? search,
            string? filterType,
            string? filterLocation)
        {
            var query = _context.Jobs
                .Include(j => j.PostedBy)
                .Where(j => j.IsActive)
                .AsQueryable();



            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();

                query = query.Where(j =>
                    j.Title.ToLower().Contains(searchLower) ||
                    j.Description.ToLower().Contains(searchLower) ||
                    j.Requirements.ToLower().Contains(searchLower));
            }



            if (!string.IsNullOrWhiteSpace(filterType))
            {
                query = query.Where(j =>
                    j.Type.ToLower() == filterType.ToLower());
            }



            if (!string.IsNullOrWhiteSpace(filterLocation))
            {
                query = query.Where(j =>
                    j.Location.ToLower()
                    .Contains(filterLocation.ToLower()));
            }



            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();


            return jobs.Select(MapToDto);
        }




        // Get job details
        public async Task<JobDto?> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.PostedBy)
                .FirstOrDefaultAsync(j => j.Id == id);


            return job == null ? null : MapToDto(job);
        }





        // Recruiter creates job
        public async Task<JobDto> CreateJobAsync(
            CreateJobDto dto,
            int recruiterId)
        {

            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Requirements = dto.Requirements,

                Location = dto.Location,
                Type = dto.Type,
                SalaryRange = dto.SalaryRange,

                PostedById = recruiterId,

                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };


            _context.Jobs.Add(job);

            await _context.SaveChangesAsync();



            var savedJob = await _context.Jobs
                .Include(j => j.PostedBy)
                .FirstAsync(j => j.Id == job.Id);


            return MapToDto(savedJob);
        }





        // Recruiter updates job
        public async Task<JobDto?> UpdateJobAsync(
            int id,
            UpdateJobDto dto,
            int recruiterId)
        {

            var job = await _context.Jobs
                .Include(j => j.PostedBy)
                .FirstOrDefaultAsync(j => j.Id == id);



            if (job == null)
                return null;



            if (job.PostedById != recruiterId)
                return null;



            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Requirements = dto.Requirements;

            job.Location = dto.Location;
            job.Type = dto.Type;
            job.SalaryRange = dto.SalaryRange;

            job.IsActive = dto.IsActive;



            await _context.SaveChangesAsync();


            return MapToDto(job);
        }





        // Delete job
        public async Task<bool> DeleteJobAsync(
            int id,
            int recruiterId)
        {

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.Id == id);



            if (job == null)
                return false;



            if (job.PostedById != recruiterId)
                return false;



            _context.Jobs.Remove(job);

            await _context.SaveChangesAsync();


            return true;
        }





        // Map Job model to DTO
        private static JobDto MapToDto(Job job)
        {
            return new JobDto
            {
                Id = job.Id,

                Title = job.Title,
                Description = job.Description,
                Requirements = job.Requirements,

                Location = job.Location,
                Type = job.Type,
                SalaryRange = job.SalaryRange,

                PostedById = job.PostedById,

                PostedByEmail =
                    job.PostedBy?.Email ?? string.Empty,

                PostedByFullName =
                    job.PostedBy?.FullName ?? string.Empty,


                CreatedAt = job.CreatedAt,

                IsActive = job.IsActive
            };
        }
    }
}