using Backend.Models.ERP;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Dapper;

namespace Backend.Controllers.ERP
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase
    {
        private readonly string _conn;

        public OrderItemsController(IConfiguration config) => _conn = config.GetConnectionString("CodeFolioDb")!;

        [HttpGet("byorder/{orderId}")]
        public async Task<IActionResult> GetByOrder(int orderId)
        {
            using var db = new MySqlConnection(_conn);

            var data = await db.QueryAsync<OrderItem>(
                @"SELECT o.Id, o.OrderId, o.ProductId, o.Quantity, o.Price,
                 p.Name AS ProductName
          FROM OrderItems o
          INNER JOIN Products p ON o.ProductId = p.Id
          WHERE o.OrderId = @OrderId",
                new { OrderId = orderId });

            return Ok(data);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            using var db = new MySqlConnection(_conn);

            var order = await db.QueryFirstOrDefaultAsync<Order>(
                "SELECT * FROM Orders WHERE Id=@Id", new { Id = id });

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderItem item)
        {
            using var db = new MySqlConnection(_conn);

            // Insert order item
            await db.ExecuteAsync(@"
            INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price)
            VALUES (@OrderId, @ProductId, @Quantity, @Price)", item);

            // Decrease stock and check
            var affected = await db.ExecuteAsync(@"
            UPDATE Products 
            SET StockQuantity = StockQuantity - @Quantity
            WHERE Id = @ProductId AND StockQuantity >= @Quantity", item);

            if (affected == 0)
            {
                return BadRequest("Insufficient stock");
            }


            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(
                "DELETE FROM OrderItems WHERE Id=@Id", new { Id = id });

            return Ok();
        }
    }
}
