using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexhire.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }


        // Job Reference
        [Required]
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public Job? Job { get; set; }


        // Candidate Reference
        [Required]
        public int CandidateId { get; set; }

        [ForeignKey("CandidateId")]
        public User? Candidate { get; set; }


        // Candidate Qualification Details

        [StringLength(100)]
        public string Education { get; set; } = string.Empty;


        [Range(0, 50)]
        public int ExperienceYears { get; set; }


        [StringLength(1000)]
        public string Skills { get; set; } = string.Empty;


        // Candidate Links

        [StringLength(500)]
        public string GithubUrl { get; set; } = string.Empty;


        [StringLength(500)]
        public string LinkedinUrl { get; set; } = string.Empty;


        [StringLength(500)]
        public string PortfolioUrl { get; set; } = string.Empty;



        // AI Evaluation Information

        [StringLength(2000)]
        public string WhySuitable { get; set; } = string.Empty;


        // Resume File Location

        [StringLength(500)]
        public string ResumePath { get; set; } = string.Empty;



        // Candidate Cover Letter

        [StringLength(2000)]
        public string CoverLetter { get; set; } = string.Empty;



        // Application Status

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Applied";



        // Application Date

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;



        // AI Result (Optional Relationship)
        // Uncomment only if AIResult model has ApplicationId foreign key

        /*
        public AIResult? AIResult { get; set; }
        */
    }
}