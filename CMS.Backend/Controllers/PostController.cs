using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
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

        // 1. DANH SÁCH BÀI VIẾT
        public IActionResult Index()
        {
            // Include Category để hiển thị tên danh mục thay vì chỉ hiển thị ID
            var data = _context.Posts.Include(p => p.Category).ToList();
            return View(data);
        }

        // 2. THÊM MỚI (Giao diện)
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // 2. THÊM MỚI (Xử lý lưu)
        [HttpPost]
        public IActionResult Create(Post post)
        {
            // Mặc định ngày tạo là hiện tại
            post.CreatedDate = DateTime.Now;
            _context.Posts.Add(post);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 3. CHỈNH SỬA (Giao diện)
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // 3. CHỈNH SỬA (Xử lý cập nhật)
        [HttpPost]
        public IActionResult Edit(Post post)
        {
            _context.Update(post);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 4. XÓA
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}