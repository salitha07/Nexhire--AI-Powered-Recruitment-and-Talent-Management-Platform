using System.ComponentModel.DataAnnotations;

namespace Nexhire.DTOs
{
    public class SubmitFeedbackDto
    {
        [Required]
        [StringLength(2000)]
        public string Feedback { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        public int Score { get; set; }
    }
}
