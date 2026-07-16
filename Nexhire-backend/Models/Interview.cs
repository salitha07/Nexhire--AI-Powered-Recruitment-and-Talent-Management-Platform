using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexhire.Models
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ApplicationId { get; set; }

        [ForeignKey("ApplicationId")]
        public Application? Application { get; set; }

        [Required]
        public int ScheduledById { get; set; }

        [ForeignKey("ScheduledById")]
        public User? ScheduledBy { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        [Required]
        [StringLength(20)]
        public string Mode { get; set; } = "Online"; // Online, In-Person, Phone

        [StringLength(255)]
        public string MeetingLink { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled

        public string Feedback { get; set; } = string.Empty;

        [Range(1, 10)]
        public int? Score { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
