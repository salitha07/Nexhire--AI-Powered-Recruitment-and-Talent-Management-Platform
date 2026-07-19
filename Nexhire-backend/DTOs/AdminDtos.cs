namespace Nexhire.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateRoleDto
    {
        public string NewRole { get; set; } = string.Empty;
    }

    public class UpdateStatusDto
    {
        public bool IsActive { get; set; }
    }

    public class AnalyticsSummaryDto
    {
        public int TotalUsers { get; set; }
        public int TotalCandidates { get; set; }
        public int TotalRecruiters { get; set; }
        public int TotalJobs { get; set; }
        public int OpenJobs { get; set; }
        public int TotalApplications { get; set; }
        public int TotalHired { get; set; }
        public int TotalInterviews { get; set; }
    }

    public class MonthlyStatDto
    {
        public string Month { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}