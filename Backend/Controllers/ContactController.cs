using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ContactController : ControllerBase
	{
		private readonly HttpClient _httpClient;

		public ContactController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpPost]
		public async Task<IActionResult> SendEmail([FromBody] Contact message)
		{
			var payload = new
			{
				to = "weijieteoh26@gmail.com",
				name = message.Name,
				email = message.Email,
				subject = message.Subject,
				message = message.Message
			};

			var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

			try
			{
				var response = await _httpClient.PostAsync("https://email.gosecureserver.in/api/send.php", content);
				if (response.IsSuccessStatusCode)
					return Ok(new { success = true });
				else
					return StatusCode(500, new { success = false, error = "Email API failed" });
			}
			catch
			{
				return StatusCode(500, new { success = false, error = "Server error" });
			}
		}
	}
}