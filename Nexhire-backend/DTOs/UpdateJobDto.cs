using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class UpdateJobDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirements { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // e.g., Full-time, Part-time, Remote, Hybrid

        [StringLength(100)]
        public string SalaryRange { get; set; } = string.Empty;

        [Required]
        public bool IsActive { get; set; }
    }
}
