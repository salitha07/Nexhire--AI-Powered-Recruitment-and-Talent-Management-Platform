using System;
using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class UpdateInterviewStatusDto
    {
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty; // Scheduled, Completed, Cancelled

        public DateTime? ScheduledAt { get; set; } // optional, set when rescheduling
    }
}
