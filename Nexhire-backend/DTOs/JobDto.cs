using System;

namespace Nexhire.DTOs
{
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public int PostedById { get; set; }
        public string PostedByEmail { get; set; } = string.Empty;
        public string PostedByFullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
