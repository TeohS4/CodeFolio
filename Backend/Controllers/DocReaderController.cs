using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using System.Net.Http.Headers;
using System.Net.Http.Json;

// Clear namespace collisions explicitly
using Size = OpenCvSharp.Size;
using Point = OpenCvSharp.Point;
using Point2f = OpenCvSharp.Point2f;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocScannerController : ControllerBase
    {
        private readonly IConfiguration _config;

        public DocScannerController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessDocument(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { processedImageBase64 = "", extractedText = "No image file payload received on backend." });

            try
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                byte[] fileBytes = ms.ToArray();
                using Mat src = Cv2.ImDecode(fileBytes, ImreadModes.Color);

                using Mat gray = new Mat();
                using Mat blurred = new Mat();
                using Mat edges = new Mat();
                // Convert to grayscale
                Cv2.CvtColor(src, gray, ColorConversionCodes.BGR2GRAY);
                Cv2.GaussianBlur(gray, blurred, new Size(5, 5), 0);
                Cv2.Canny(blurred, edges, 75, 200);
                
                Cv2.FindContours(edges, out Point[][] contours, out _, RetrievalModes.List, ContourApproximationModes.ApproxSimple);

                Point[] docContour = null;
                double maxArea = 0;

                foreach (var contour in contours)
                {
                    double area = Cv2.ContourArea(contour);
                    if (area > 1000)
                    {
                        double peri = Cv2.ArcLength(contour, true);
                        Point[] approx = Cv2.ApproxPolyDP(contour, 0.02 * peri, true);

                        if (approx.Length == 4 && area > maxArea)
                        {
                            docContour = approx;
                            maxArea = area;
                        }
                    }
                }
                using Mat finalProcessed = (docContour != null && docContour.Length >= 4)
                    ? WarpPerspective(src, docContour)
                    : src.Clone();

                // Downscale and compress image to avoid the 4MB payload block
                using Mat resizedMat = new Mat();
                int targetWidth = 800; 
                int targetHeight = (int)((double)finalProcessed.Height / finalProcessed.Width * targetWidth);
                Cv2.Resize(finalProcessed, resizedMat, new Size(targetWidth, targetHeight), 0, 0, InterpolationFlags.Linear);

                // Set JPEG encoding compression parameters
                int[] compressionParams = new int[] { (int)ImwriteFlags.JpegQuality, 75 };
                byte[] processedBytes = resizedMat.ToBytes(".jpg", compressionParams);

                // Query Groq Cloud Vision LPU Gateway
                string extractedAiText = await CallGroqVisionApi(processedBytes);

                return Ok(new
                {
                    ProcessedImageBase64 = Convert.ToBase64String(processedBytes),
                    ExtractedText = extractedAiText
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    processedImageBase64 = "",
                    extractedText = $"[INTERNAL BACKEND ERROR]: {ex.Message} \nTrace: {ex.StackTrace}"
                });
            }
        }
        // Using cloud ai model to extract the text from the processed image
        private async Task<string> CallGroqVisionApi(byte[] imageBytes)
        {
            string? apiKey = _config["Groq:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return "Configuration Error: 'Groq:ApiKey' key configuration pathway cannot be resolved.";
            }

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            string base64Image = Convert.ToBase64String(imageBytes);
            string dataUrl = $"data:image/jpeg;base64,{base64Image}";

            // check for size limit
            double payloadSizeInMb = (double)base64Image.Length / (1024 * 1024);
            if (payloadSizeInMb > 4.0)
            {
                return $"Error: Payload size ({payloadSizeInMb:F2}MB) exceeds Groq's 4MB limit. Re-compressing image rules required.";
            }

            // Enforce clean structured collection object mapping layouts for serialization
            var requestPayload = new Dictionary<string, object>
            {
                { "model", "qwen/qwen3.6-27b" },
                { "messages", new[]
                    {
                        new {
                            role = "user",
                            content = new object[] {
                                new { type = "text", text = "You are a professional document scanner. Transcribe all text from this image exactly as it appears into Markdown. Output ONLY the raw markdown transcription result. Do NOT output any analysis, thoughts, bullet identification lists, introduction blocks, conversational filler, or reasoning." },
                                new { type = "image_url", image_url = new { url = dataUrl } }
                            }
                        }
                    }
                },
                { "reasoning_format", "hidden" },
                { "temperature", 0.0 }
            };


            string groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
            var response = await client.PostAsJsonAsync(groqEndpoint, requestPayload);

            if (!response.IsSuccessStatusCode)
            {
                string errorDetails = await response.Content.ReadAsStringAsync();
                return $"Groq LPU Processing Rejection: {response.StatusCode} - {errorDetails}";
            }

            var jsonResult = await response.Content.ReadFromJsonAsync<GroqResponse>();
            return jsonResult?.Choices?.FirstOrDefault()?.Message?.Content ?? "Cloud vision extraction process executed blank results.";
        }

        private Mat WarpPerspective(Mat src, Point[] points)
        {
            var orderedPoints = points.OrderBy(p => p.X + p.Y).ToArray();

            Point2f[] srcPts = new Point2f[] {
                new Point2f(orderedPoints[0].X, orderedPoints[0].Y),
                new Point2f(orderedPoints[1].X, orderedPoints[1].Y),
                new Point2f(orderedPoints[2].X, orderedPoints[2].Y),
                new Point2f(orderedPoints[3].X, orderedPoints[3].Y)
            };

            int width = 800; int height = 1000;
            Point2f[] dstPts = new Point2f[] {
                new Point2f(0, 0), new Point2f(width, 0),
                new Point2f(width, height), new Point2f(0, height)
            };

            Mat M = Cv2.GetPerspectiveTransform(srcPts, dstPts);
            Mat warped = new Mat();
            Cv2.WarpPerspective(src, warped, M, new Size(width, height));
            return warped;
        }
    }

}
public class GroqResponse
{
    public List<Choice> Choices { get; set; } = new();
}

public class Choice
{
    public Message Message { get; set; } = new();
}

public class Message
{
    public string Content { get; set; } = string.Empty;
}

