using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Namespace chứa entity User của bạn
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách người dùng giả lập
            var users = new List<User>
            {
                new User { Id = 1, Username = "admin", FullName = "Phạm Đăng Khoa", Role = "Quản trị viên" },
                new User { Id = 2, Username = "editor01", FullName = "Nguyễn Văn A", Role = "Biên tập viên" },
                new User { Id = 3, Username = "khoapham", FullName = "Khoa Phạm", Role = "Quản trị viên" }
            };

            return View(users);
        }
    }
}