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
    // Tạo sẵn các class nhận dữ liệu ngay tại đây
    public class OrderDetailInput
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class OrderInput
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public System.Collections.Generic.List<OrderDetailInput> OrderDetails { get; set; } = new();
    }

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

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInput input)
        {
            if (input == null) return BadRequest("Dữ liệu gửi lên trống!");

            try
            {
                // Tạo mới đơn hàng
                var order = new Order
                {
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes,
                    OrderDate = DateTime.Now // Lưu ý: Thuộc tính trong DB là OrderDate, không phải CreatedAt
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Lưu để lấy ID Đơn hàng

                // Thêm chi tiết đơn hàng
                if (input.OrderDetails != null && input.OrderDetails.Any())
                {
                    foreach (var item in input.OrderDetails)
                    {
                        var detail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = item.UnitPrice
                        };
                        _context.OrderDetails.Add(detail);
                    }
                    await _context.SaveChangesAsync();
                }

                // Trả về Object ẩn danh phẳng để CHỐNG LỖI VÒNG LẶP JSON VÀ LỖI ERR_EMPTY_RESPONSE
                return Ok(new { success = true, message = "Đặt hàng thành công!", orderId = order.Id });
            }
            catch (Exception ex)
            {
                // Trả về thông báo lỗi thay vì sập server
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }
    }
}
