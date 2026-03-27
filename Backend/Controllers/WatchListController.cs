using Microsoft.AspNetCore.Mvc;
using Dapper;
using MySql.Data.MySqlClient;
using Backend.Models;
using System.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WatchlistController : ControllerBase
    {
        private readonly string _connectionString;

        public WatchlistController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CodeFolioDb")
                ?? throw new InvalidOperationException("Connection string not found.");
        }

        private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);
        // Read
        [HttpGet]
        public async Task<IActionResult> GetWatchlist()
        {
            using var db = CreateConnection();
            const string sql = @"SELECT id, title, overview, 
                                 poster_path AS PosterPath, 
                                 release_date AS ReleaseDate 
                                 FROM watchlist";
            var movies = await db.QueryAsync<Movie>(sql);
            return Ok(movies);
        }
        // Add
        [HttpPost]
        public async Task<IActionResult> AddToWatchlist([FromBody] Movie movie)
        {
            using var db = CreateConnection();
            const string sql = @"INSERT INTO watchlist (id, title, overview, poster_path, release_date) 
                                 VALUES (@Id, @Title, @Overview, @PosterPath, @ReleaseDate)
                                 ON DUPLICATE KEY UPDATE title = @Title";

            await db.ExecuteAsync(sql, movie);
            return Ok(new { message = "Movie saved to watchlist" });
        }
        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFromWatchlist(long id)
        {
            using var db = CreateConnection();
            const string sql = "DELETE FROM watchlist WHERE id = @id";
            var affected = await db.ExecuteAsync(sql, new { id });

            return affected > 0 ? Ok() : NotFound();
        }
    }
}