using Backend.Models.ERP;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Dapper;

namespace Backend.Controllers.ERP
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly string _conn;

        public CustomersController(IConfiguration config)
            => _conn = config.GetConnectionString("CodeFolioDb")!;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            using var db = new MySqlConnection(_conn);
            var data = await db.QueryAsync("SELECT * FROM Customers");
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Customer c)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(@"
        INSERT INTO Customers (Name, Email, Phone)
        VALUES (@Name, @Email, @Phone)", c);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer c)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(@"
            UPDATE Customers 
            SET Name=@Name, Email=@Email, Phone=@Phone
            WHERE Id=@Id",
            new { Id = id, Name = c.Name, Email = c.Email, Phone = c.Phone });

            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(
                "DELETE FROM Customers WHERE Id=@Id", new { Id = id });

            return Ok();
        }
    }
}
