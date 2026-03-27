using Microsoft.AspNetCore.Mvc;
using Dapper;
using MySql.Data.MySqlClient;
using Backend.Models;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly string _conn;
    public TaskController(IConfiguration config) => _conn = config.GetConnectionString("CodeFolioDb")!;

    // Display data
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        using var db = new MySqlConnection(_conn);
        var tasks = await db.QueryAsync<TaskItem>("SELECT * FROM tasks ORDER BY position ASC");
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        using var db = new MySqlConnection(_conn);
        const string sql = @"INSERT INTO tasks (name, description, done, position, priority) 
        VALUES (@Name, @Description, @Done, 
        (SELECT IFNULL(MAX(position) + 1, 0) FROM tasks t), @Priority)";
        await db.ExecuteAsync(sql, task);
        return Ok();
    }

    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<TaskItem> tasks)
    {
        using var db = new MySqlConnection(_conn);
        db.Open();
        using var transaction = db.BeginTransaction();
        try
        {
            // Update positions based on the new array index from Angular
            for (int i = 0; i < tasks.Count; i++)
            {
                await db.ExecuteAsync(
                    "UPDATE tasks SET position = @pos WHERE id = @id",
                    new { pos = i, id = tasks[i].Id },
                    transaction
                );
            }
            transaction.Commit();
            return Ok();
        }
        catch
        {
            transaction.Rollback();
            return StatusCode(500);
        }
    }
    // Update
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem task)
    {
        using var db = new MySqlConnection(_conn);
        db.Open();
        try
        {
            var affected = await db.ExecuteAsync(
            @"UPDATE tasks 
              SET name = @Name, 
                  description = @Description, 
                  done = @Done,
                  priority = @Priority
              WHERE id = @id",
            new { id, task.Name, task.Description, task.Done, task.Priority }
        );

            if (affected == 0) return NotFound();

            return Ok();
        }
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        using var db = new MySqlConnection(_conn);
        await db.ExecuteAsync("DELETE FROM tasks WHERE id = @id", new { id });
        return Ok();
    }
}