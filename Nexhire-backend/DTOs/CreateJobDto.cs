using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class CreateJobDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;


        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;


        [StringLength(1000)]
        public string Requirements { get; set; } = string.Empty;



        [StringLength(100)]
        public string Location { get; set; } = string.Empty;


        [StringLength(100)]
        public string Type { get; set; } = string.Empty;


        [StringLength(100)]
        public string Category { get; set; } = string.Empty;


        [StringLength(100)]
        public string SalaryRange { get; set; } = string.Empty;
    }
}