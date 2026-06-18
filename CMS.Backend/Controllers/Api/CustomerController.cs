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
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        private Customer GetCustomerFromToken()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                try
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();
                    var decodedToken = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                    var parts = decodedToken.Split(':');
                    if (parts.Length == 2 && int.TryParse(parts[0], out int customerId))
                    {
                        var email = parts[1];
                        return _context.Customers.FirstOrDefault(c => c.Id == customerId && c.Email == email);
                    }
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }

        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var customer = GetCustomerFromToken();
            if (customer == null)
            {
                return Unauthorized(new { message = "Vui lòng đăng nhập để tiếp tục." });
            }

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }
    }
}
