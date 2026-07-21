using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexhire.Models
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }


        // Application Reference

        [Required]
        public int ApplicationId { get; set; }


        [ForeignKey("ApplicationId")]
        public Application? Application { get; set; }



        // Recruiter/User who schedules interview

        [Required]
        public int ScheduledById { get; set; }


        [ForeignKey("ScheduledById")]
        public User? ScheduledBy { get; set; }



        // Interview Details

        [Required]
        public DateTime ScheduledAt { get; set; }



        [Required]
        [StringLength(20)]
        public string Mode { get; set; } = "Online";



        [StringLength(255)]
        public string MeetingLink { get; set; } = string.Empty;



        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Scheduled";



        [StringLength(2000)]
        public string Feedback { get; set; } = string.Empty;



        [Range(1, 10)]
        public int? Score { get; set; }



        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}