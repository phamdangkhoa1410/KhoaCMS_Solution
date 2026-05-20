/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Version 1.2 - Thống kê dữ liệu Dashboard
 */

using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Nhớ thêm dòng này để nhận diện Database
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context; // Khai báo kết nối DB

        // Constructor tiêm thêm ApplicationDbContext vào để dùng
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // CẬP NHẬT HÀM INDEX ĐỂ LẤY SỐ LIỆU ĐẾM
        public IActionResult Index()
        {
            // Đếm số lượng thực tế từ các bảng trong SQL Server
            ViewBag.TotalCategories = _context.Categories.Count();
            ViewBag.TotalPosts = _context.Posts.Count();
            ViewBag.TotalUsers = _context.Users.Count();

            // Lấy danh sách 5 bài viết mới nhất để làm bảng tin nhanh trên Dashboard
            var recentPosts = _context.Posts.OrderByDescending(p => p.Id).Take(5).ToList();

            return View(recentPosts);
        }

        public IActionResult Privacy() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}