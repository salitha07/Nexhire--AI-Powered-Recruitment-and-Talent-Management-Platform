using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexhire.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }


        // Job Information

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;


        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;


        // Used by AI matching
        [StringLength(1000)]
        public string Requirements { get; set; } = string.Empty;



        // Job Details

        [StringLength(100)]
        public string Location { get; set; } = string.Empty;


        [StringLength(100)]
        public string Type { get; set; } = string.Empty;


        [StringLength(100)]
        public string Category { get; set; } = string.Empty;


        [StringLength(100)]
        public string SalaryRange { get; set; } = string.Empty;



        // Recruiter Reference

        [Required]
        public int PostedById { get; set; }


        [ForeignKey("PostedById")]
        public User? PostedBy { get; set; }



        // Status

        public bool IsActive { get; set; } = true;



        // Created Date

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        // Applications submitted for this job

        public ICollection<Application> Applications { get; set; }
            = new List<Application>();
    }
}