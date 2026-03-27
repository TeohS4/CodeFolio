namespace Backend.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool Done { get; set; }
        public int Position { get; set; }
        public string Priority { get; set; } = "green";
    }
}