using Dapper;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Backend
{
    public class DatabaseHelper
    {
        private readonly string _connectionString;

        public DatabaseHelper(IConfiguration configuration)
        {
            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));

            _connectionString = configuration.GetConnectionString("CodeFolioDb") 
                ?? throw new InvalidOperationException("Connection string 'CodeFolioDb' not found.");
        }

        public IDbConnection GetConnection() => new MySqlConnection(_connectionString);

        public bool TestConnection()
        {
            try
            {
                using var conn = GetConnection();
                conn.Open();
                Console.WriteLine("✅ Connected to MySQL successfully!");
                return true;
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"❌ MySQL Error: {ex.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ General Error: {ex.Message}");
                return false;
            }
        }
    }
}