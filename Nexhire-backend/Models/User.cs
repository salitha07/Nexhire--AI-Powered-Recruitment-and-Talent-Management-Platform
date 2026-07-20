using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Nexhire.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }



        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;



        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;



        [Required]
        public string PasswordHash { get; set; } = string.Empty;



        // Candidate / Recruiter

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = string.Empty;



        public bool IsActive { get; set; } = true;



        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        // Jobs posted by recruiter

        public ICollection<Job> PostedJobs { get; set; }
            = new List<Job>();


        // Applications submitted by candidate

        public ICollection<Application> Applications { get; set; }
            = new List<Application>();
    }
}