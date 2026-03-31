using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Backend.Models.ERP;
using Dapper;

namespace Backend.Controllers.ERP
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly string _conn;

        public OrdersController(IConfiguration config)
            => _conn = config.GetConnectionString("CodeFolioDb")!;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            using var db = new MySqlConnection(_conn);

            var sql = @"
        SELECT 
            o.Id as id,
            o.CustomerId as customerId,
            o.OrderDate as orderDate,
            o.TotalAmount as totalAmount,
            c.Name as customerName,
            c.Email as customerEmail
        FROM Orders o
        INNER JOIN Customers c ON o.CustomerId = c.Id";

            var data = await db.QueryAsync(sql);
            return Ok(data);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            using var db = new MySqlConnection(_conn);

            var sql = @"
        SELECT 
            o.Id as id,
            o.CustomerId as customerId,
            o.OrderDate as orderDate,
            o.TotalAmount as totalAmount,
            c.Name as customerName,
            c.Email as customerEmail
        FROM Orders o
        INNER JOIN Customers c ON o.CustomerId = c.Id
        WHERE o.Id = @Id";

            var order = await db.QueryFirstOrDefaultAsync(sql, new { Id = id });

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            using var db = new MySqlConnection(_conn);

            var sql = @"
            INSERT INTO Orders (CustomerId, TotalAmount)
            VALUES (@CustomerId, @TotalAmount);
            SELECT LAST_INSERT_ID();";

            var orderId = await db.ExecuteScalarAsync<int>(sql, order);

            return Ok(orderId);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer c)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(@"
            UPDATE Customers 
            SET Name=@Name, Email=@Email, Phone=@Phone
            WHERE Id=@Id",
                new { Id = id, c.Name, c.Email, c.Phone });

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var db = new MySqlConnection(_conn);

            // Delete order items first
            await db.ExecuteAsync("DELETE FROM OrderItems WHERE OrderId = @Id", new { Id = id });

            // Then delete the order
            var affected = await db.ExecuteAsync("DELETE FROM Orders WHERE Id = @Id", new { Id = id });

            if (affected == 0)
                return NotFound();

            return Ok();
        }
    }
}
