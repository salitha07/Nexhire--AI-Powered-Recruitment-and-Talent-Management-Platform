using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class UpdateApplicationStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;
    }
}