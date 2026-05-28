/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Cấu hình chuẩn tuyệt đối cho API Danh mục bài viết (Đã ẩn chữ API trên Swagger bằng Tags)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/categories")] // Đường dẫn API chuẩn: api/categories
    [ApiController]
    [Tags("Categories")] 
    public class CategoriesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories
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
        public async Task<IActionResult> Create([FromBody] CategoryCreateDTO input)
        {
            if (input == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            try
            {
                var newCategory = new CMS.Data.Entities.Category { Name = input.Name, Description = input.Description };
                _context.Categories.Add(newCategory);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { message = "Thành công!", id = newCategory.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi ngầm", detail = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateDTO input)
        {
            if (input == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null) return NotFound();

                category.Name = input.Name;
                category.Description = input.Description;

                _context.Categories.Update(category);
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
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null) return NotFound();

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi ngầm", detail = ex.Message });
            }
        }
    }

    public class CategoryCreateDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}