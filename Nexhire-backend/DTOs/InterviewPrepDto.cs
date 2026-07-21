namespace Nexhire.DTOs
{
    /// <summary>
    /// AI-generated interview preparation suggestions returned to the recruiter.
    /// </summary>
    public class InterviewPrepDto
    {
        /// <summary>Recommended interview mode: "Online", "In-Person", or "Phone"</summary>
        public string RecommendedMode { get; set; } = string.Empty;

        /// <summary>Recommended interview duration e.g. "45 minutes"</summary>
        public string RecommendedDuration { get; set; } = string.Empty;

        /// <summary>Short rationale explaining the AI's recommendation</summary>
        public string Rationale { get; set; } = string.Empty;

        /// <summary>Skill/topic areas the recruiter should probe based on gaps found</summary>
        public List<string> FocusAreas { get; set; } = new();

        /// <summary>5 tailored interview questions specific to this candidate and role</summary>
        public List<string> SuggestedQuestions { get; set; } = new();
    }
}
