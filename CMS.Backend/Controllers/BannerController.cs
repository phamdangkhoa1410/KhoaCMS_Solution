/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: CMS.Backend/Controllers/BannerController.cs
 * Chức năng: Bộ điều hướng MVC quản lý Banner Slider (Razor View Admin)
 *            [V2 - UPLOAD FILE]: Thay logic nhập URL text → Upload file ảnh thật
 *            File được lưu vào wwwroot/uploads/banners/ với tên GUID duy nhất
 *            Chỉ sau khi lưu file thành công mới gán đường dẫn vào ImageUrl → DB
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả "Quản trị viên" và "Editor" đều được vào quản lý Banner
    [Authorize(Roles = "Quản trị viên,Editor")]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;
        // Thư mục vật lý lưu file banner (tương đối trong wwwroot)
        private const string UPLOAD_SUBFOLDER = "uploads/banners";

        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // HELPER: Xử lý upload file ảnh banner
        // ===================================================
        /// <summary>
        /// Nhận IFormFile, kiểm tra hợp lệ, lưu vào wwwroot/uploads/banners/,
        /// trả về đường dẫn tương đối dạng /uploads/banners/xxxx.jpg
        /// Trả về null nếu file không hợp lệ hoặc không được cung cấp.
        /// </summary>
        private async Task<string?> SaveBannerImageAsync(IFormFile? imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return null;

            // ─── KIỂM TRA ĐỊNH DẠNG FILE ────────────────────────────────────────
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                ModelState.AddModelError("imageFile", "Chỉ chấp nhận ảnh định dạng: JPG, JPEG, PNG, GIF, WEBP, BMP.");
                return null;
            }

            // ─── KIỂM TRA KÍCH THƯỚC (Tối đa 10MB) ────────────────────────────
            const long maxSize = 10 * 1024 * 1024; // 10 MB
            if (imageFile.Length > maxSize)
            {
                ModelState.AddModelError("imageFile", "Kích thước file ảnh không được vượt quá 10MB.");
                return null;
            }

            // ─── TẠO THƯ MỤC NẾU CHƯA TỒN TẠI ────────────────────────────────
            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot", UPLOAD_SUBFOLDER.Replace('/', Path.DirectorySeparatorChar)
            );
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // ─── SINH TÊN FILE DUY NHẤT BẰNG GUID ─────────────────────────────
            var uniqueFileName = Guid.NewGuid().ToString("N") + extension;
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            // ─── LƯU FILE VẬT LÝ VÀO wwwroot/uploads/banners/ ─────────────────
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // ─── TRẢ VỀ ĐƯỜNG DẪN TƯƠNG ĐỐI (/uploads/banners/xxxx.jpg) ────────
            return $"/{UPLOAD_SUBFOLDER}/{uniqueFileName}";
        }

        /// <summary>
        /// Xóa file ảnh vật lý cũ khỏi wwwroot khi không còn cần thiết
        /// </summary>
        private void DeleteOldImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;
            try
            {
                var filePath = Path.Combine(
                    Directory.GetCurrentDirectory(), "wwwroot",
                    imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar)
                );
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }
            catch
            {
                // Bỏ qua lỗi xóa file - không ảnh hưởng đến logic chính
            }
        }

        // ===================================================
        // 1. DANH SÁCH BANNER (INDEX)
        // ===================================================
        public IActionResult Index()
        {
            var data = _context.Banners
                               .OrderBy(b => b.Position)
                               .ToList();
            return View(data);
        }

        // ===================================================
        // 2. THÊM BANNER MỚI (CREATE)
        // ===================================================
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Banner banner, IFormFile imageFile)
        {
            // ─── XỬ LÝ UPLOAD FILE ẢNH ──────────────────────────────────────────
            var savedPath = await SaveBannerImageAsync(imageFile);

            if (savedPath == null)
            {
                // Nếu không có file được upload → báo lỗi bắt buộc
                ModelState.AddModelError("imageFile", "Vui lòng chọn file ảnh banner để upload.");
            }
            else
            {
                // Gán đường dẫn file vào thuộc tính ImageUrl của Entity
                banner.ImageUrl = savedPath;
                // Xóa lỗi validation của ImageUrl (nếu có) vì giờ đã có giá trị
                ModelState.Remove(nameof(banner.ImageUrl));
            }

            if (ModelState.IsValid)
            {
                _context.Banners.Add(banner);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đã thêm banner \"{banner.Title ?? "Không tên"}\" và upload ảnh thành công!";
                return RedirectToAction("Index");
            }

            return View(banner);
        }

        // ===================================================
        // 3. CHỈNH SỬA BANNER (EDIT)
        // ===================================================
        public IActionResult Edit(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Banner banner, IFormFile? imageFile)
        {
            // ─── LẤY ẢNH CŨ TỪ DB ──────────────────────────────────────────────
            var existingBanner = _context.Banners.AsNoTracking().FirstOrDefault(b => b.Id == banner.Id);
            if (existingBanner == null) return NotFound();

            // ─── XỬ LÝ UPLOAD FILE MỚI (NẾU CÓ) ────────────────────────────────
            if (imageFile != null && imageFile.Length > 0)
            {
                var savedPath = await SaveBannerImageAsync(imageFile);
                if (savedPath != null)
                {
                    // Xóa file ảnh cũ khỏi server trước khi gán ảnh mới
                    DeleteOldImage(existingBanner.ImageUrl);
                    banner.ImageUrl = savedPath;
                }
                // Nếu SaveBannerImageAsync trả null → ModelState đã có lỗi → sẽ return View bên dưới
            }
            else
            {
                // Không có file mới → giữ nguyên đường dẫn ảnh cũ
                banner.ImageUrl = existingBanner.ImageUrl;
            }

            // Xóa lỗi validation cho ImageUrl vì giá trị đã được xử lý bằng tay
            ModelState.Remove(nameof(banner.ImageUrl));

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(banner);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = $"Đã cập nhật banner \"{banner.Title ?? "Không tên"}\" thành công!";
                    return RedirectToAction("Index");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", $"Lỗi hệ thống khi lưu: {ex.Message}");
                    return View(banner);
                }
            }

            return View(banner);
        }

        // ===================================================
        // 4. XÓA BANNER (DELETE) — Chỉ Quản trị viên
        // ===================================================
        [Authorize(Roles = "Quản trị viên")]
        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner != null)
            {
                // Xóa file ảnh vật lý khỏi wwwroot/uploads/banners/ trước khi xóa bản ghi DB
                DeleteOldImage(banner.ImageUrl);

                _context.Banners.Remove(banner);
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã xóa banner \"{banner.Title ?? $"ID={id}"}\" và ảnh khỏi server thành công!";
            }
            return RedirectToAction("Index");
        }
    }
}
