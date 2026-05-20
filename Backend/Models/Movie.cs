namespace Backend.Models
{
    public class Movie
    {
        public long id { get; set; }
        public string? title { get; set; }
        public string? overview { get; set; }
        public string? poster_path { get; set; }
        public string? release_date { get; set; }
    }
}