using Backend.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly string _conn;

        public EmployeeController(IConfiguration config)
        {
            _conn = config.GetConnectionString("CodeFolioDb")!;
            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            using var db = new MySqlConnection(_conn);
            const string sql = "SELECT * FROM employees ORDER BY id ASC";
            var employees = await db.QueryAsync<Employee>(sql);
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            using var db = new MySqlConnection(_conn);
            var employee = await db.QueryFirstOrDefaultAsync<Employee>(
                "SELECT * FROM employees WHERE id = @Id",
                new { Id = id }
            );

            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Employee employee)
        {
            using var db = new MySqlConnection(_conn);

            const string sql = @"
                INSERT INTO employees (name, job_title, department, status, join_date, salary)
                VALUES (@Name, @JobTitle, @Department, @Status, @JoinDate, @Salary)";

            await db.ExecuteAsync(sql, employee);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee employee)
        {
            using var db = new MySqlConnection(_conn);

            const string sql = @"
                UPDATE employees
                SET name = @Name,
                    job_title = @JobTitle,
                    department = @Department,
                    status = @Status,
                    join_date = @JoinDate,
                    salary = @Salary
                WHERE id = @Id";

            var rows = await db.ExecuteAsync(sql, new
            {
                employee.Name,
                employee.JobTitle,
                employee.Department,
                employee.Status,
                employee.JoinDate,
                employee.Salary,
                Id = id
            });

            if (rows == 0) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var db = new MySqlConnection(_conn);
            var rows = await db.ExecuteAsync("DELETE FROM employees WHERE id = @Id", new { Id = id });
            return rows > 0 ? Ok() : NotFound();
        }
    }
}