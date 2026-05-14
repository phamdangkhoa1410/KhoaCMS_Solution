using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. TRANG DANH SÁCH
        public IActionResult Index()
        {
            var data = _context.Categories.ToList();
            return View(data);
        }

        // 2. THÊM MỚI (Giao diện)
        public IActionResult Create() => View();

        // 2. THÊM MỚI (Xử lý lưu)
        [HttpPost]
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges(); // Lưu vào SQL
            return RedirectToAction("Index");
        }

        // 3. SỬA (Giao diện)
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            return View(category);
        }

        // 3. SỬA (Xử lý cập nhật)
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            _context.Update(category);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 4. XÓA
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}