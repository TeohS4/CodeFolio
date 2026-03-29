using Backend.Models;
using Dapper;
using MySqlConnector;
namespace Backend.Services

{
    public class AuthService
    {
        private readonly string _conn;
        private readonly JwtHelper _jwt;

        public AuthService(IConfiguration config, JwtHelper jwt)
        {
            _conn = config.GetConnectionString("CodeFolioDb")!;
            _jwt = jwt;
        }

        public async Task<AuthResponse?> Login(LoginRequest req)
        {
            using var db = new MySqlConnection(_conn);

            var user = await db.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Username = @Username",
                new { req.Username }
            );

            if (user == null) return null;

            // ⚠️ Replace with proper hashing (e.g. BCrypt)
            if (user.Password != req.Password)
                return null;

            var token = _jwt.GenerateToken(user.Id, user.Username);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username
            };
        }
    }
}
