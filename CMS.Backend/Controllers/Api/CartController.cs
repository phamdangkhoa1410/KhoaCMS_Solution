using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class AddToCartRequest
        {
            public int CustomerId { get; set; }
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            // Tìm giỏ hàng của khách, nếu chưa có thì tạo mới
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId);

            if (cart == null)
            {
                cart = new Cart { CustomerId = request.CustomerId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(); // Lưu để có CartId
            }

            // Kiểm tra tồn kho của sản phẩm
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm." });
            }

            // Kiểm tra sản phẩm đã có trong giỏ chưa
            var existingDetail = cart.CartDetails.FirstOrDefault(cd => cd.ProductId == request.ProductId);
            
            // Tính tổng số lượng nếu thêm vào
            int totalQuantity = request.Quantity + (existingDetail != null ? existingDetail.Quantity : 0);
            
            if (totalQuantity > product.StockQuantity)
            {
                return BadRequest(new { 
                    message = $"Số lượng vượt quá tồn kho! (Trong kho: {product.StockQuantity}, Trong giỏ: {existingDetail?.Quantity ?? 0})" 
                });
            }

            if (existingDetail != null)
            {
                existingDetail.Quantity = totalQuantity;
            }
            else
            {
                var newDetail = new CartDetail
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartDetails.Add(newDetail);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm vào giỏ hàng thành công!" });
        }

        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCart(int customerId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                    .ThenInclude(cd => cd.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return Ok(new object[] { }); // Trả về mảng rỗng nếu chưa có giỏ hàng
            }

            var result = cart.CartDetails.Select(cd => new
            {
                cartDetailId = cd.Id, // Id của chi tiết giỏ hàng để xóa/cập nhật nếu cần
                id = cd.ProductId,
                name = cd.Product.Name,
                price = cd.Product.Price,
                imageUrl = cd.Product.ImageUrl,
                quantity = cd.Quantity
            });

            return Ok(result);
        }

        public class UpdateQuantityRequest
        {
            public int CustomerId { get; set; }
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }

        [HttpPut("UpdateQuantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityRequest request)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId);

            if (cart == null) return NotFound("Không tìm thấy giỏ hàng.");

            var detail = cart.CartDetails.FirstOrDefault(cd => cd.ProductId == request.ProductId);
            if (detail == null) return NotFound("Sản phẩm không có trong giỏ hàng.");

            if (request.Quantity <= 0)
            {
                _context.CartDetails.Remove(detail);
            }
            else
            {
                detail.Quantity = request.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật số lượng thành công!" });
        }

        [HttpDelete("Remove/{customerId}/{productId}")]
        public async Task<IActionResult> RemoveItem(int customerId, int productId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null) return NotFound("Không tìm thấy giỏ hàng.");

            var detail = cart.CartDetails.FirstOrDefault(cd => cd.ProductId == productId);
            if (detail != null)
            {
                _context.CartDetails.Remove(detail);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Xóa sản phẩm thành công!" });
        }

        [HttpDelete("Clear/{customerId}")]
        public async Task<IActionResult> ClearCart(int customerId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart != null)
            {
                _context.CartDetails.RemoveRange(cart.CartDetails);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Đã làm sạch giỏ hàng!" });
        }
    }
}
