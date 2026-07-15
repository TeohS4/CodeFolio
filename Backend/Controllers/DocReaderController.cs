using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using System.Net.Http.Headers;
using System.Net.Http.Json;

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
                return BadRequest(new { processedImageBase64 = "", extractedText = "No image file received." });

            try
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                byte[] fileBytes = ms.ToArray();

                using Mat src = Cv2.ImDecode(fileBytes, ImreadModes.Color);

                if (src.Empty())
                {
                    return BadRequest(new
                    {
                        processedImageBase64 = "",
                        extractedText = "Invalid image format."
                    });
                }

                using Mat gray = new Mat();
                using Mat blurred = new Mat();
                using Mat edges = new Mat();

                Cv2.CvtColor(src, gray, ColorConversionCodes.BGR2GRAY);
                Cv2.GaussianBlur(gray, blurred, new Size(3, 3), 0);
                Cv2.Canny(blurred, edges, 50, 150);

                Cv2.FindContours(
                    edges,
                    out Point[][] contours,
                    out _,
                    RetrievalModes.List,
                    ContourApproximationModes.ApproxSimple
                );

                Point[]? docContour = null;
                double maxArea = 0;

                foreach (var contour in contours)
                {
                    double area = Cv2.ContourArea(contour);

                    if (area < 1000)
                        continue;

                    double peri = Cv2.ArcLength(contour, true);

                    Point[] approx = Cv2.ApproxPolyDP(
                        contour,
                        0.02 * peri,
                        true
                    );

                    if (approx.Length == 4 && area > maxArea)
                    {
                        docContour = approx;
                        maxArea = area;
                    }
                }

                Mat finalProcessed;

                if (docContour != null)
                {
                    double areaRatio = maxArea / (src.Width * src.Height);

                    if (areaRatio > 0.2)
                        finalProcessed = WarpPerspective(src, docContour);
                    else
                        finalProcessed = src.Clone();
                }
                else
                {
                    finalProcessed = src.Clone();
                }

                using Mat resizedMat = new Mat();

                int targetWidth = 1200;
                int targetHeight = (int)((double)finalProcessed.Height / finalProcessed.Width * targetWidth);

                Cv2.Resize(
                    finalProcessed,
                    resizedMat,
                    new Size(targetWidth, targetHeight),
                    0,
                    0,
                    InterpolationFlags.Linear
                );

                int[] compressionParams =
                {
                    (int)ImwriteFlags.JpegQuality,
                    80
                };

                byte[] processedBytes = resizedMat.ToBytes(".jpg", compressionParams);

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
                    extractedText = $"[BACKEND ERROR]: {ex.Message}"
                });
            }
        }

        private async Task<string> CallGroqVisionApi(byte[] imageBytes)
        {
            string? apiKey = _config["Groq:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
                return "Missing Groq API key.";

            using var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            string base64Image = Convert.ToBase64String(imageBytes);

            string dataUrl = $"data:image/jpeg;base64,{base64Image}";

            var requestPayload = new Dictionary<string, object>
            {
                {
                    "model",
                    "qwen/qwen3.6-27b"
                },
                {
                    "messages",
                    new[]
                    {
                        new
                        {
                            role = "user",
                            content = new object[]
                            {
                                new
                                {
                                    type = "text",
                                    text = "Extract all readable text from this document image. Preserve tables, numbers, headings, and structure. Return only Markdown."
                                },
                                new
                                {
                                    type = "image_url",
                                    image_url = new
                                    {
                                        url = dataUrl
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "temperature",
                    0
                }
            };

            string endpoint = "https://api.groq.com/openai/v1/chat/completions";

            var response = await client.PostAsJsonAsync(endpoint, requestPayload);

            if (!response.IsSuccessStatusCode)
            {
                string error = await response.Content.ReadAsStringAsync();
                return $"Groq Error: {response.StatusCode} - {error}";
            }

            var result = await response.Content.ReadFromJsonAsync<GroqResponse>();

            return result?.Choices?.FirstOrDefault()?.Message?.Content
                ?? "No text detected.";
        }

        private Mat WarpPerspective(Mat src, Point[] points)
        {
            var orderedPoints = points.OrderBy(p => p.X + p.Y).ToArray();

            Point2f[] srcPts =
            {
                new Point2f(orderedPoints[0].X, orderedPoints[0].Y),
                new Point2f(orderedPoints[1].X, orderedPoints[1].Y),
                new Point2f(orderedPoints[2].X, orderedPoints[2].Y),
                new Point2f(orderedPoints[3].X, orderedPoints[3].Y)
            };

            int width = 1200;
            int height = 1600;

            Point2f[] dstPts =
            {
                new Point2f(0,0),
                new Point2f(width,0),
                new Point2f(width,height),
                new Point2f(0,height)
            };

            Mat matrix = Cv2.GetPerspectiveTransform(srcPts, dstPts);

            Mat warped = new Mat();

            Cv2.WarpPerspective(
                src,
                warped,
                matrix,
                new Size(width, height)
            );

            return warped;
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
}