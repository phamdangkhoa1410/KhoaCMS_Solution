/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 3.2 - Hoàn thiện logic CRUD Bài viết kèm Upload/Xóa file ảnh vật lý
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.IO;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: TRANG DANH SÁCH BÀI VIẾT (INDEX)
        // ===================================================
        public IActionResult Index()
        {
            // Lấy danh sách bài viết kèm danh mục, sắp xếp bài mới nhất lên đầu
            var data = _context.Posts.Include(p => p.Category).OrderByDescending(p => p.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: THÊM MỚI BÀI VIẾT (CREATE)
        // ===================================================
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post post, IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                var filePath = Path.Combine(uploadFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(fileStream);
                }

                post.ImageUrl = "/uploads/" + uniqueFileName;
            }

            post.CreatedDate = DateTime.Now;
            _context.Posts.Add(post);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA BÀI VIẾT (EDIT)
        // ===================================================
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post post, IFormFile? imageFile)
        {
            try
            {
                // Lấy thông tin bản ghi cũ trong database ra để so sánh hình ảnh (dùng AsNoTracking để tránh trùng entity)
                var existingPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == post.Id);
                if (existingPost == null) return NotFound();

                if (imageFile != null && imageFile.Length > 0)
                {
                    var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    var filePath = Path.Combine(uploadFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    // Gán đường dẫn file ảnh mới cho bài viết
                    post.ImageUrl = "/uploads/" + uniqueFileName;

                    // KIỂM TRA & XÓA FILE ẢNH CŨ TRÊN Ổ CỨNG MÁY TÍNH ĐỂ TRÁNH RÁC THƯ MỤC UPLOADS
                    if (!string.IsNullOrEmpty(existingPost.ImageUrl))
                    {
                        var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingPost.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                }
                else
                {
                    // Nếu Khoa không chọn file ảnh mới, giữ nguyên đường dẫn ảnh cũ của bài viết đó
                    post.ImageUrl = existingPost.ImageUrl;
                }

                // Giữ lại ngày tạo gốc của bài viết
                post.CreatedDate = existingPost.CreatedDate;

                _context.Update(post);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
                return View(post);
            }
        }

        // ===================================================
        // 4. CHỨC NĂNG: XÓA BÀI VIẾT (DELETE)
        // ===================================================
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                // XÓA FILE ẢNH VẬT LÝ KHỎI THƯ MỤC WWWROOT TRƯỚC KHI XÓA DỮ LIỆU TRONG SQL
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}