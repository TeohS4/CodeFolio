using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public AiController(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        [HttpPost("summary")]
        public async Task<IActionResult> GenerateSummary([FromBody] Ai project)
        {
            var apiKey = _config["Groq:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return BadRequest(new { error = "Missing Groq API key" });
            }

            // Step 1: Format the project data into a human-readable "Fact Sheet"
            // This prevents the AI from getting lost in JSON syntax.
            var techStack = string.Join(", ", project.Stack);
            var featureList = string.Join("\n- ", project.Features);

            var prompt = $@"
            Write a professional software engineering portfolio summary for this project.
            
            PROJECT DATA:
            - Title: {project.Title}
            - Tech Stack: {techStack}
            - Key Features: 
            - {featureList}

            INSTRUCTIONS:
            - Write in a professional, recruiter-focused tone.
            - Categorize the Tech Stack into 'Frontend' and 'Backend' where applicable.
            - Use a 'Key Contributions' or 'Features' section with bullet points.
            - Keep the summary concise but impactful.
            ";

            // Step 2: Prepare the Groq Request Payload
            var requestBody = new
            {
                model = "llama-3.3-70b-versatile",
                messages = new[]
                {
                    new { role = "system", content = "You are an expert technical writer for software engineering portfolios." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.5, // Lowered temperature for more consistent professional formatting
                max_tokens = 1000
            };

            var jsonPayload = JsonSerializer.Serialize(requestBody);

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
            request.Headers.Add("Authorization", $"Bearer {apiKey}");
            request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.SendAsync(request);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new { error = "Groq API Error", details = responseJson });
                }

                // Step 3: Extract the content safely
                using var doc = JsonDocument.Parse(responseJson);
                var resultText = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return Ok(new { summary = resultText });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
