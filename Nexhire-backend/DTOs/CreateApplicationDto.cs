using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class CreateApplicationDto
    {
        [Required]
        public int JobId { get; set; }

        // Candidate Profile Information

        [StringLength(100)]
        public string Education { get; set; } = string.Empty;

        [Range(0, 50)]
        public int ExperienceYears { get; set; }

        [StringLength(1000)]
        public string Skills { get; set; } = string.Empty;

        [StringLength(500)]
        public string GithubUrl { get; set; } = string.Empty;

        [StringLength(500)]
        public string LinkedinUrl { get; set; } = string.Empty;

        [StringLength(500)]
        public string PortfolioUrl { get; set; } = string.Empty;

        [StringLength(2000)]
        public string WhySuitable { get; set; } = string.Empty;

        // Resume file path (this will be used after implementing file upload)
        [StringLength(500)]
        public string ResumePath { get; set; } = string.Empty;

        // Cover Letter

        [StringLength(2000)]
        public string CoverLetter { get; set; } = string.Empty;
    }
}