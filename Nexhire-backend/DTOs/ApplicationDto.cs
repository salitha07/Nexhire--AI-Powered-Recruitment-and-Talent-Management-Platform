using System;

namespace Nexhire.DTOs
{
    public class ApplicationDto
    {
        public int Id { get; set; }

        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string JobLocation { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;

        public int CandidateId { get; set; }
        public string CandidateFullName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;

        // Candidate Profile Information
        public string Education { get; set; } = string.Empty;

        public int ExperienceYears { get; set; }

        public string Skills { get; set; } = string.Empty;

        public string GithubUrl { get; set; } = string.Empty;

        public string LinkedinUrl { get; set; } = string.Empty;

        public string PortfolioUrl { get; set; } = string.Empty;

        public string WhySuitable { get; set; } = string.Empty;

        public string ResumePath { get; set; } = string.Empty;

        // Cover Letter
        public string CoverLetter { get; set; } = string.Empty;

        // Application Status
        public string Status { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; }
    }
}