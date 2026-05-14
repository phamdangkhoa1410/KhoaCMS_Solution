using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH NGƯỜI DÙNG
        public IActionResult Index()
        {
            var data = _context.Users.ToList();
            return View(data);
        }

        // 2. TẠO MỚI (Giao diện)
        public IActionResult Create()
        {
            return View();
        }

        // 2. TẠO MỚI (Xử lý lưu)
        [HttpPost]
        public IActionResult Create(User user)
        {
            // Trong thực tế cần mã hóa PasswordHash, hiện tại lưu thô để Khoa dễ test
            _context.Users.Add(user);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 3. CHỈNH SỬA (Giao diện)
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // 3. CHỈNH SỬA (Xử lý)
        [HttpPost]
        public IActionResult Edit(User user)
        {
            _context.Update(user);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 4. XÓA
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}