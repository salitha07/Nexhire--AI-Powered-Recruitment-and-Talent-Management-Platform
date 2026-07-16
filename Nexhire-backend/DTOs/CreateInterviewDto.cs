using System;
using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class CreateInterviewDto
    {
        [Required]
        public int ApplicationId { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        [Required]
        [StringLength(20)]
        public string Mode { get; set; } = "Online"; // Online, In-Person, Phone

        [StringLength(255)]
        public string MeetingLink { get; set; } = string.Empty;
    }
}
