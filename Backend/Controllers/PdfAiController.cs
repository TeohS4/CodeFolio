using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Docnet.Core;
using Docnet.Core.Models;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfAiController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public PdfAiController(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzePdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid PDF file.");

            try
            {
                var apiKey = _config["Groq:ApiKey"];
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                // render PDF pages as base64 images
                var base64Images = await RenderPdfPagesToBase64(file);

                if (!base64Images.Any())
                    return BadRequest("Could not render PDF pages.");

                // build vision message — max 5 images for Groq limit
                var imageContents = base64Images.Take(5).Select(b64 => (object)new
                {
                    type = "image_url",
                    image_url = new { url = $"data:image/png;base64,{b64}" }
                }).ToList();

                imageContents.Insert(0, new
                {
                    type = "text",
                    text = "Extract all the text from these PDF page images exactly as they appear, preserving structure."
                });

                // extract text using llama vision model
                var extractPayload = new
                {
                    model = "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages = new[]
                    {
                new { role = "user", content = imageContents }
            }
                };

                var extractResponse = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", extractPayload);
                var extractJson = await extractResponse.Content.ReadAsStringAsync();
                var extractData = JObject.Parse(extractJson);
                var extractedText = extractData["choices"]?[0]?["message"]?["content"]?.ToString() ?? "";

                // summarize the extracted text using regular model
                var summaryPayload = new
                {
                    model = "llama-3.3-70b-versatile",
                    messages = new[]
                    {
                new { role = "system", content = "Summarize the document text into concise bullet points. Use fewer points for short documents and more for longer ones, but never exceed 5 bullet points" },
                new { role = "user", content = extractedText }
            }
                };

                var summaryResponse = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", summaryPayload);
                var resultJson = await summaryResponse.Content.ReadAsStringAsync();

                var groqData = JObject.Parse(resultJson);
                groqData["extractedText"] = extractedText; // return the text to frontend

                return Ok(groqData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion([FromBody] AskRequest request)
        {
            try
            {
                var apiKey = _config["Groq:ApiKey"];
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var payload = new
                {
                    model = "llama-3.3-70b-versatile",
                    messages = new[] {
                        new { role = "system", content = "Answer the question based strictly on the document text provided." },
                        new { role = "user", content = $"Document Context: {request.Text} \n\n Question: {request.Question}" }
                    }
                };

                var response = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", payload);
                var resultJson = await response.Content.ReadAsStringAsync();
                return Ok(JsonConvert.DeserializeObject(resultJson));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<List<string>> RenderPdfPagesToBase64(IFormFile file)
        {
            var results = new List<string>();

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var pdfBytes = ms.ToArray();

            using var library = DocLib.Instance;
            using var docReader = library.GetDocReader(pdfBytes, new PageDimensions(1080, 1920));

            var pageCount = Math.Min(docReader.GetPageCount(), 5);

            for (int i = 0; i < pageCount; i++)
            {
                using var pageReader = docReader.GetPageReader(i);
                var width = pageReader.GetPageWidth();
                var height = pageReader.GetPageHeight();
                var rawBytes = pageReader.GetImage(); // BGRA format

                using var bitmap = new System.Drawing.Bitmap(width, height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                var bitmapData = bitmap.LockBits(
                    new System.Drawing.Rectangle(0, 0, width, height),
                    System.Drawing.Imaging.ImageLockMode.WriteOnly,
                    bitmap.PixelFormat);

                System.Runtime.InteropServices.Marshal.Copy(rawBytes, 0, bitmapData.Scan0, rawBytes.Length);
                bitmap.UnlockBits(bitmapData);

                using var pngStream = new MemoryStream();
                bitmap.Save(pngStream, System.Drawing.Imaging.ImageFormat.Png);
                results.Add(Convert.ToBase64String(pngStream.ToArray()));
            }

            return results;
        }
    }
}
