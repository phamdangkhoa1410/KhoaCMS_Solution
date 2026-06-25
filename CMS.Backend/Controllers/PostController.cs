/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 5.3 - Hoàn thiện Phân quyền chi tiết (Role-based) cho Post theo kịch bản của Thầy
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // BƯỚC KHAI BÁO: Nhúng thư viện bảo mật hệ thống
using CMS.Data;
using CMS.Data.Entities;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả tài khoản "Quản trị viên" và "Editor" đều được quyền truy cập vào xem và chỉnh sửa bài viết
    [Authorize(Roles = "Quản trị viên,Editor")]
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
        public IActionResult Index(int? id, int page = 1)
        {
            int pageSize = 5;
            IQueryable<Post> query;

            if (id == null)
            {
                query = _context.Posts.Include(p => p.Category).OrderByDescending(p => p.Id);
                ViewBag.CurrentCategoryName = "Tất cả bài viết";
            }
            else
            {
                query = _context.Posts.Where(p => p.CategoryId == id).Include(p => p.Category).OrderByDescending(p => p.CreatedDate);
                var cat = _context.Categories.Find(id);
                ViewBag.CurrentCategoryName = cat != null ? "Danh mục: " + cat.Name : "Danh mục không tồn tại";
            }

            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.CategoryId = id;

            var data = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return View(data);
        }

        // ===================================================
        // 1.3. CHỨC NĂNG: X XEM CHI TIẾT BÀI VIẾT (DETAILS)
        // ===================================================
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
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

                    post.ImageUrl = "/uploads/" + uniqueFileName;

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
                    post.ImageUrl = existingPost.ImageUrl;
                }

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
        // 4. CHỨC NĂNG: XÓA BÀI VIẾT (PHÂN QUYỀN RIÊNG BIỆT)
        // ===================================================
        // Ổ KHÓA ĐÈ: Chỉ duy nhất tài khoản có vai trò "Quản trị viên" mới được xóa bài viết.
        // Tài khoản "Editor" bấm vào nút xóa sẽ lập tức kích hoạt lỗi 403 AccessDenied!
        [Authorize(Roles = "Quản trị viên")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
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