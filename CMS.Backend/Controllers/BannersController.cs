/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: CMS.Backend/Controllers/BannersController.cs
 * Chức năng: API Controller quản lý Banner Slider - Cấp đầy đủ endpoints CRUD (GET/POST/PUT/DELETE)
 *            GET /api/banners         → Công khai: Lấy danh sách banner đang bật (Status=true)
 *            GET /api/banners/all     → Admin: Lấy toàn bộ kể cả banner đang tắt
 *            POST /api/banners        → Admin: Thêm banner mới
 *            PUT /api/banners/{id}    → Admin: Cập nhật banner theo ID
 *            DELETE /api/banners/{id} → Admin: Xóa banner theo ID
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================================
        // 1. GET /api/banners — CÔNG KHAI: Lấy danh sách banner đang bật
        //    Sắp xếp theo Position tăng dần để đảm bảo thứ tự slider
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetActiveBanners()
        {
            var banners = await _context.Banners
                .Where(b => b.Status == true)
                .OrderBy(b => b.Position)
                .Select(b => new
                {
                    b.Id,
                    b.ImageUrl,
                    b.Title,
                    b.Description,
                    b.Link,
                    b.Position,
                    b.Status
                })
                .ToListAsync();

            return Ok(banners);
        }

        // ============================================================
        // 2. GET /api/banners/all — ADMIN: Lấy toàn bộ banner (kể cả đã tắt)
        // ============================================================
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBanners()
        {
            var banners = await _context.Banners
                .OrderBy(b => b.Position)
                .ToListAsync();

            return Ok(banners);
        }

        // ============================================================
        // 3. GET /api/banners/{id} — Lấy chi tiết 1 banner theo ID
        // ============================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return NotFound(new { message = "Không tìm thấy banner với ID này." });

            return Ok(banner);
        }

        // ============================================================
        // 4. POST /api/banners — ADMIN: Thêm banner mới vào Database
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Banner banner)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = banner.Id }, banner);
        }

        // ============================================================
        // 5. PUT /api/banners/{id} — ADMIN: Cập nhật thông tin banner
        // ============================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Banner bannerUpdate)
        {
            if (id != bannerUpdate.Id)
                return BadRequest(new { message = "ID trong URL và Body không khớp nhau." });

            var existing = await _context.Banners.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy banner cần cập nhật." });

            // Cập nhật từng trường thủ công để tránh lỗi EntityState tracking
            existing.ImageUrl    = bannerUpdate.ImageUrl;
            existing.Title       = bannerUpdate.Title;
            existing.Description = bannerUpdate.Description;
            existing.Link        = bannerUpdate.Link;
            existing.Position    = bannerUpdate.Position;
            existing.Status      = bannerUpdate.Status;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // ============================================================
        // 6. DELETE /api/banners/{id} — ADMIN: Xóa banner theo ID
        // ============================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return NotFound(new { message = "Banner không tồn tại, không thể xóa." });

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa banner ID={id} thành công.", id });
        }
    }
}
