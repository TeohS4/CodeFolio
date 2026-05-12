using Microsoft.AspNetCore.Mvc;
using UglyToad.PdfPig;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

                // 1. Extract text
                using var document = PdfDocument.Open(file.OpenReadStream());
                var extractedText = string.Join(" ", document.GetPages().Select(p => p.Text));

                // 2. Setup Groq Request
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var payload = new
                {
                    model = "llama-3.3-70b-versatile",
                    messages = new[] {
                        new { role = "system", content = "Summarize the following document text into 3 clear bullet points." },
                        new { role = "user", content = extractedText }
                    }
                };

                // 3. Call Groq
                var response = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", payload);
                var resultJson = await response.Content.ReadAsStringAsync();
                
                // 4. Merge Groq Response with the Extracted Text
                var groqData = JObject.Parse(resultJson);
                groqData["extractedText"] = extractedText;

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
    }

    public class AskRequest
    {
        public string Text { get; set; }
        public string Question { get; set; }
    }
}
