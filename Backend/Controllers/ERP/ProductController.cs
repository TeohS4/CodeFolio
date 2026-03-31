using Backend.Models.ERP;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Dapper;

namespace Backend.Controllers.ERP
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly string _conn;

        public ProductsController(IConfiguration config)
            => _conn = config.GetConnectionString("CodeFolioDb")!;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            using var db = new MySqlConnection(_conn);
            var data = await db.QueryAsync("SELECT * FROM Products");
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            using var db = new MySqlConnection(_conn);
            var data = await db.QueryFirstOrDefaultAsync(
                "SELECT * FROM Products WHERE Id=@Id", new { Id = id });

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product p)
        {
            using var db = new MySqlConnection(_conn);

            const string sql = @"
        INSERT INTO Products (Name, SKU, Category, Price, StockQuantity)
        VALUES (@Name, @SKU, @Category, @Price, @StockQuantity)";

            await db.ExecuteAsync(sql, p);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product p)
        {
            using var db = new MySqlConnection(_conn);

            const string sql = @"
            UPDATE Products 
            SET Name=@Name, SKU=@SKU, Category=@Category, 
                Price=@Price, StockQuantity=@StockQuantity
            WHERE Id=@Id";

            await db.ExecuteAsync(sql, new
            {
                Id = id,
                p.Name,
                p.SKU,
                p.Category,
                p.Price,
                p.StockQuantity
            });

            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var db = new MySqlConnection(_conn);

            await db.ExecuteAsync(
                "DELETE FROM Products WHERE Id=@Id", new { Id = id });

            return Ok();
        }
    }
}
