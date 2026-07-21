using System;
using System.ComponentModel.DataAnnotations;

namespace Nexhire.Models
{
    public class AIResult
    {
        [Key]
        public int Id { get; set; }


        // Foreign Key to Application

        [Required]
        public int ApplicationId { get; set; }


        // AI Match Score (0-100)

        [Range(0, 100)]
        public int MatchScore { get; set; }


        // Skills extracted by AI

        [StringLength(2000)]
        public string ExtractedSkills { get; set; } = string.Empty;


        // AI Recommendation

        [StringLength(500)]
        public string Recommendation { get; set; } = string.Empty;


        // Created Date

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        // Navigation Property

        public Application? Application { get; set; }
    }
}