using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class CreateApplicationDto
    {
        [Required]
        public int JobId { get; set; }

        [StringLength(2000)]
        public string CoverLetter { get; set; } = string.Empty;
    }
}