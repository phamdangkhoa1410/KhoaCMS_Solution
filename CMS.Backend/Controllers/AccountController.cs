using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using CMS.Data;

/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 5.5 - Buổi 5: 
 */

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. LUỒNG GET: HIỂN THỊ GIAO DIỆN ĐĂNG NHẬP
        // ==========================================
        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // ==========================================
        // 2. LUỒNG POST: TIẾP NHẬN & XỬ LÝ ĐĂNG NHẬP
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("FullName", user.FullName ?? user.Username)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity)
                );

                return RedirectToAction("Index", "Home");
            }

            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu hệ thống không đúng!";
            return View();
        }

        // ==========================================
        // 3. LUỒNG ĐĂNG XUẤT: HỦY COOKIE BẢO MẬT
        // ==========================================
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // ==========================================
        //  4 : XỬ LÝ TRANG TỪ CHỐI TRUY CẬP
        // ==========================================
        [HttpGet]
        public IActionResult AccessDenied()
        {
            // Trả về View AccessDenied.cshtml nằm trong thư mục Views/Account
            return View();
        }
    }
}