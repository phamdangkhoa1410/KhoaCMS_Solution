/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Cấu hình chuẩn tuyệt đối cho API Danh mục sản phẩm (Đã ẩn chữ API trên Swagger bằng Tags)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/categoriesproducts")] // Ép cứng đường dẫn chuẩn chữ thường
    [ApiController]
    [Tags("CategoriesProducts")] // Đổi tên tiêu đề hiển thị trên Swagger thành "CategoriesProducts" sạch sẽ
    public class CategoriesProductsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .Select(c => new { c.Id, c.Name, c.Description })
                    .ToListAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi kết nối", detail = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProductCreateDTO input)
        {
            if (input == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            try
            {
                var newCategory = new CMS.Data.Entities.CategoryProduct
                {
                    Name = input.Name,
                    Description = input.Description
                };
                _context.CategoriesProducts.Add(newCategory);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { message = "Thành công!", id = newCategory.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi ngầm", detail = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProductCreateDTO input)
        {
            if (input == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            try
            {
                var category = await _context.CategoriesProducts.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null) return NotFound();

                category.Name = input.Name;
                category.Description = input.Description;

                _context.CategoriesProducts.Update(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi ngầm", detail = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.CategoriesProducts.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null) return NotFound();

                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi ngầm", detail = ex.Message });
            }
        }
    }

    public class CategoryProductCreateDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}