using System;

namespace Nexhire.DTOs
{
    public class InterviewDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public int CandidateId { get; set; }
        public string CandidateFullName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public string Mode { get; set; } = string.Empty;
        public string MeetingLink { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Feedback { get; set; } = string.Empty;
        public int? Score { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
