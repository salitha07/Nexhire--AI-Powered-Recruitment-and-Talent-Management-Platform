namespace Nexhire.Models
{
    public class AIResult
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int MatchScore { get; set; }
        public string ExtractedSkills { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Application? Application { get; set; }
    }
}
