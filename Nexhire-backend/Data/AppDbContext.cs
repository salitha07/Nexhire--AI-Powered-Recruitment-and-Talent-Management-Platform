using Microsoft.EntityFrameworkCore;
using Nexhire.Models;

namespace Nexhire.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }


        public DbSet<User> Users { get; set; }

        public DbSet<Job> Jobs { get; set; }

        public DbSet<Application> Applications { get; set; }

        public DbSet<AIResult> AIResults { get; set; }

        public DbSet<Interview> Interviews { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            // User email must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();



            // Candidate can apply only once for a job
            modelBuilder.Entity<Application>()
                .HasIndex(a => new { a.JobId, a.CandidateId })
                .IsUnique();



            // Application -> Job
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade);



            // Application -> Candidate(User)
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);



            // AIResult -> Application (One-to-One)
            modelBuilder.Entity<AIResult>()
                .HasOne(r => r.Application)
                .WithOne()
                .HasForeignKey<AIResult>(r => r.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);



            // Interview -> Application
            modelBuilder.Entity<Interview>()
                .HasOne(i => i.Application)
                .WithMany()
                .HasForeignKey(i => i.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);



            // Interview -> Scheduled User
            modelBuilder.Entity<Interview>()
                .HasOne(i => i.ScheduledBy)
                .WithMany()
                .HasForeignKey(i => i.ScheduledById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}