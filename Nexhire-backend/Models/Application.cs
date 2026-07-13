using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexhire.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public Job? Job { get; set; }

        [Required]
        public int CandidateId { get; set; }

        [ForeignKey("CandidateId")]
        public User? Candidate { get; set; }

        public string CoverLetter { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Applied";

        [Required]
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
}