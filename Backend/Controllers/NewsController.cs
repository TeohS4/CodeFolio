using Dapper;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Data;
using MySql.Data.MySqlClient;
using System.Net;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly string _connectionString;
        public NewsController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CodeFolioDb");
        }

        private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

        [HttpGet("bookmark")]
        public async Task<IActionResult> GetBookmarks()
        {
            using var db = CreateConnection();
            const string sql = @"
                SELECT title, description, url, url_to_image AS UrlToImage, 
                       source_name AS SourceName, published_at AS PublishedAt
                FROM news_bookmark
                ORDER BY published_at DESC";

            var bookmarks = await db.QueryAsync<NewsArticle>(sql);
            return Ok(bookmarks);
        }

        [HttpPost("bookmark")]
        public async Task<IActionResult> AddToBookmark([FromBody] NewsArticle news)
        {
            using var db = CreateConnection();
            const string sql = @"
                INSERT INTO news_bookmark (title, description, url, url_to_image, source_name, published_at)
                VALUES (@Title, @Description, @Url, @UrlToImage, @SourceName, @PublishedAt)
                ON DUPLICATE KEY UPDATE
                    description = @Description,
                    url_to_image = @UrlToImage,
                    source_name = @SourceName,
                    published_at = @PublishedAt";

            await db.ExecuteAsync(sql, news);
            return Ok(new { message = "News added to bookmarks" });
        }

        [HttpDelete("bookmark/{*url}")]
        public async Task<IActionResult> DeleteBookmark([FromRoute] string url)
        {
            if (string.IsNullOrEmpty(url))
                return BadRequest(new { message = "URL is required" });

            // Decode the URL because Angular's HttpClient will encode it
            var decodedUrl = WebUtility.UrlDecode(url);

            using var db = CreateConnection();
            const string sql = @"DELETE FROM news_bookmark WHERE url = @Url";

            var rows = await db.ExecuteAsync(sql, new { Url = decodedUrl });

            if (rows == 0)
                return NotFound(new { message = "Bookmark not found" });

            return Ok(new { message = "Bookmark deleted" });
        }
    }
}