namespace Backend.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; }
        public decimal Salary { get; set; }
    }
}
