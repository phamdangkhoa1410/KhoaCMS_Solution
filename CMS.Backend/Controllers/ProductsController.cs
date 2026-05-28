/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Buổi 6 - Bài tập mở rộng 1: API Quản lý sản phẩm chuẩn gọt tỉa dữ liệu
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // Cấu hình đường dẫn gọi API: https://localhost:xxxx/api/products
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo: Tiêm kết nối Database Context vào Controller
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. API: LẤY TOÀN BỘ DANH SÁCH SẢN PHẨM (Có gọt tỉa tối ưu băng thông)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy sản phẩm, sắp xếp mới nhất lên đầu và chỉ bốc các trường cần thiết ra trang chủ
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct.Name // Lấy tên phân loại trực tiếp thay vì ID cộc lốc
                })
                .ToListAsync();

            return Ok(products);
        }

        // =========================================================================
        // 2. API: LỌC SẢN PHẨM THEO DANH MỤC (Có gọt tỉa dữ liệu)
        // Đường dẫn gọi dữ liệu: api/products/categoryproduct/{categoryProductId}
        // =========================================================================
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        // =========================================================================
        // 3. API: XEM CHI TIẾT 1 SẢN PHẨM (Trả về 100% thuộc tính để đọc mô tả)
        // Đường dẫn gọi dữ liệu: api/products/{id}
        // =========================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            // Trả về nguyên vẹn để trang chi tiết đọc được cột mô tả vải [Description]
            return Ok(product);
        }
    }
}