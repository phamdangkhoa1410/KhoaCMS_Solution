/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Text;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class RegisterRequest
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (_context.Customers.Any(c => c.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            var customer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                Password = HashPassword(request.Password) // Băm mật khẩu SHA256 trước khi lưu
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký tài khoản thành công." });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Băm mật khẩu người dùng nhập vào để so sánh
            string hashedPassword = HashPassword(request.Password);
            var customer = _context.Customers.FirstOrDefault(c => c.Email == request.Email && c.Password == hashedPassword);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            // Sinh Token đơn giản: Base64(Id:Email)
            var tokenString = $"{customer.Id}:{customer.Email}";
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenString));

            return Ok(new
            {
                token = token,
                user = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    role = "Customer" // Trả về Role Customer để hiển thị nếu cần
                }
            });
        }
    }
}
