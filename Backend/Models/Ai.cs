namespace Backend.Models
{
    public class Ai
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Stack { get; set; } = new();
        public List<string> Features { get; set; } = new();
    }
}
