using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public DbController(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("connect")]
        public IActionResult Connect()
        {
            bool isConnected = _dbHelper.TestConnection();
            if (isConnected)
                return Ok("✅ Dapper successfully connected to MySQL!");
            else
                return BadRequest("❌ Failed to connect to MySQL!");
        }
    }
}