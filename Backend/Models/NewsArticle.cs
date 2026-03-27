namespace Backend.Models
{
    public class NewsArticle
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Url { get; set; }
        public required string UrlToImage { get; set; }
        public required string SourceName { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}