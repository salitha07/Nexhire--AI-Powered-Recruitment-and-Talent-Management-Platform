namespace Nexhire.DTOs
{
    /// <summary>
    /// Response DTO returned from the AI ranking endpoints.
    /// Avoids exposing the raw EF model (navigation property) over the wire.
    /// </summary>
    public class AIResultDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int MatchScore { get; set; }
        public string ExtractedSkills { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
