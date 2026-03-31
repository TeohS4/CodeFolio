using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Auth;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req)
        {
            var result = await _authService.Login(req);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }
    }
}
