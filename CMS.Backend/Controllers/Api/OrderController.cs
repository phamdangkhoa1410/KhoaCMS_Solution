/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        private readonly IEmailService _emailService;

        public OrderController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
                        imageUrl = od.Product.ImageUrl,
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

                // Thêm chi tiết đơn hàng và xử lý trừ kho
                if (input.OrderDetails != null && input.OrderDetails.Any())
                {
                    foreach (var item in input.OrderDetails)
                    {
                        // Kiểm tra tồn kho
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product == null)
                        {
                            return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại!" });
                        }

                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { message = $"Số lượng sản phẩm '{product.Name}' trong kho không đủ (Chỉ còn {product.StockQuantity})!" });
                        }

                        // Trừ tồn kho
                        product.StockQuantity -= item.Quantity;
                        _context.Products.Update(product);

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

                // Lấy thông tin khách hàng để gửi Email
                var customer = await _context.Customers.FindAsync(input.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    decimal totalAmount = input.OrderDetails.Sum(d => d.Quantity * d.UnitPrice);
                    
                    var emailHtml = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;'>
                            <div style='background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%); padding: 20px; text-align: center; color: white;'>
                                <h2>Cảm ơn bạn đã đặt hàng!</h2>
                                <p>Đơn hàng #{order.Id} của bạn đã được tiếp nhận.</p>
                            </div>
                            <div style='padding: 20px; background-color: #f8fafc;'>
                                <p><strong>Khách hàng:</strong> {customer.FullName}</p>
                                <p><strong>Ngày đặt:</strong> {order.OrderDate.ToString("dd/MM/yyyy HH:mm")}</p>
                                <p><strong>Tổng tiền:</strong> <span style='color: #ef4444; font-size: 1.2rem; font-weight: bold;'>{totalAmount.ToString("N0")} VNĐ</span></p>
                                <hr style='border-top: 1px dashed #cbd5e1; margin: 20px 0;'/>
                                <p style='font-size: 0.9rem; color: #64748b;'>Đơn hàng của bạn sẽ sớm được xử lý và giao đến tận nơi. Xin chân thành cảm ơn vì đã lựa chọn Khoa Laptop Management System!</p>
                            </div>
                        </div>";

                    // Chạy nền gửi mail (không block luồng trả về)
                    _ = _emailService.SendEmailAsync(customer.Email, $"[KHOA-CMS] Xác nhận Đơn hàng #{order.Id}", emailHtml);
                }

                // Trả về Object ẩn danh phòng lỗi CHỐNG LỖI VÒNG LẶP JSON VÀ LỖI ERR_EMPTY_RESPONSE
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
