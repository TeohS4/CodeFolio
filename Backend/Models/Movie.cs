using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Movie
    {
        public long Id { get; set; } // TMDB ID
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        [JsonPropertyName("poster_path")] // Maps Angular's "poster_path" to C# "PosterPath"
        public string? PosterPath { get; set; }

        [JsonPropertyName("release_date")] // Maps Angular's "release_date" to C# "ReleaseDate"
        public string? ReleaseDate { get; set; }
    }
}