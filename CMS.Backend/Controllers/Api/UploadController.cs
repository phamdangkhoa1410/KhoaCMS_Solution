using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        // POST: /api/upload
        [HttpPost]
        public async Task<IActionResult> Post(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
            {
                return BadRequest(new
                {
                    uploaded = 0,
                    error = new { message = "Không có tệp nào được tải lên." }
                });
            }

            // Kiểm tra định dạng tệp (chỉ cho phép ảnh)
            var extension = Path.GetExtension(upload.FileName).ToLower();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            if (Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new
                {
                    uploaded = 0,
                    error = new { message = "Chỉ cho phép tải lên tệp hình ảnh (.jpg, .png, .gif, .webp)." }
                });
            }

            try
            {
                // Tạo tên file ngẫu nhiên để tránh trùng lặp
                var fileName = Guid.NewGuid().ToString() + extension;
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "ckeditor");
                
                // Đảm bảo thư mục tồn tại
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                // Trả về JSON theo định dạng chuẩn của CKEditor 4
                var url = $"/uploads/ckeditor/{fileName}";
                return Ok(new
                {
                    uploaded = 1,
                    fileName = fileName,
                    url = url
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    uploaded = 0,
                    error = new { message = $"Lỗi server: {ex.Message}" }
                });
            }
        }
    }
}
