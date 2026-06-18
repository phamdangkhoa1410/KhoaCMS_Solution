/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Text;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
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

        [HttpGet("my-orders")]
        public IActionResult GetMyOrders()
        {
            var customer = GetCustomerFromToken();
            if (customer == null)
            {
                return Unauthorized(new { message = "Vui lòng đăng nhập để tiếp tục." });
            }

            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customer.Id)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    id = o.Id,
                    orderDate = o.OrderDate,
                    totalAmount = o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice),
                    status = o.Status,
                    notes = o.Notes,
                    items = o.OrderDetails.Select(od => new
                    {
                        productId = od.ProductId,
                        productName = od.Product.Name,
                        quantity = od.Quantity,
                        price = od.UnitPrice
                    }).ToList()
                })
                .ToList();

            return Ok(orders);
        }
    }
}
