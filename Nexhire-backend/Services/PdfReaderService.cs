using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace Nexhire.Services
{
    /// <summary>
    /// Extracts raw text from a PDF resume file stored on disk.
    /// Used by AIService to include resume content in the AI prompt.
    /// </summary>
    public class PdfReaderService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<PdfReaderService> _logger;

        public PdfReaderService(
            IWebHostEnvironment environment,
            ILogger<PdfReaderService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Reads a PDF at the given relative URL path (e.g. /uploads/resumes/abc.pdf)
        /// and returns the extracted plain text. Returns empty string on any failure.
        /// </summary>
        public string ExtractText(string resumeUrl)
        {
            if (string.IsNullOrWhiteSpace(resumeUrl))
                return string.Empty;

            try
            {
                // Map the URL path to a physical file path
                var webRoot = _environment.WebRootPath
                    ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                // resumeUrl looks like "/uploads/resumes/uuid.pdf"
                var relativePath = resumeUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                var filePath = Path.Combine(webRoot, relativePath);

                if (!File.Exists(filePath))
                {
                    _logger.LogWarning("Resume PDF not found at path: {Path}", filePath);
                    return string.Empty;
                }

                var sb = new StringBuilder();

                using var pdf = PdfDocument.Open(filePath);

                foreach (Page page in pdf.GetPages())
                {
                    // GetText() extracts raw words in reading order
                    sb.AppendLine(page.Text);
                }

                var text = sb.ToString().Trim();

                // Cap at 3000 chars so we don't blow the token limit
                if (text.Length > 3000)
                    text = text[..3000] + "\n[Resume truncated for token limit]";

                return text;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract text from resume: {Url}", resumeUrl);
                return string.Empty;
            }
        }
    }
}
