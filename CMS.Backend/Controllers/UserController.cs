/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 5.3 - Hoàn thiện Bước 1 & Bước 2 Phần B: Gắn bộ phân quyền nghiêm ngặt "Quản trị viên"
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // PHẦN B - BƯỚC 1: Khai báo thư viện bảo mật hệ thống
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // PHẦN B - BƯỚC 2: Chỉ tài khoản có Role là "Quản trị viên" mới được phép truy cập vào Controller này.
    // Nếu tài khoản mang quyền "Editor" cố tình truy cập vào, Middleware sẽ tự động chặn lại và đá sang trang cấm /Account/AccessDenied.
    [Authorize(Roles = "Quản trị viên")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH NGƯỜI DÙNG (INDEX)
        // ===================================================
        public IActionResult Index()
        {
            var data = _context.Users.OrderByDescending(u => u.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: TẠO TÀI KHOẢN MỚI (CREATE)
        // ===================================================
        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(User user)
        {
            var isDuplicate = _context.Users.Any(u => u.Username == user.Username);
            if (isDuplicate)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người sử dụng!");
                return View(user);
            }

            _context.Users.Add(user);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA TÀI KHOẢN (EDIT)
        // ===================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User user, string NewPassword)
        {
            try
            {
                // Lấy thông tin bản ghi gốc đang lưu trong Database ra (dùng AsNoTracking)
                var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
                if (existingUser == null) return NotFound();

                // KHU VỰC CHẶN 1: Kiểm tra nếu Khoa đổi Username mà trùng với tài khoản khác
                var isDuplicateUsername = _context.Users.Any(u => u.Username == user.Username && u.Id != user.Id);
                if (isDuplicateUsername)
                {
                    ViewBag.ValidationError = "Tên đăng nhập này đã tồn tại trong hệ thống! Vui lòng chọn tên khác.";
                    return View(user);
                }

                // KHU VỰC CHẶN 2: LOGIC KIỂM TRA ĐỔI TRÙNG MẬT KHẨU CŨ
                if (!string.IsNullOrWhiteSpace(NewPassword))
                {
                    var newPasswordTrimmed = NewPassword.Trim();

                    // Nếu mật khẩu mới nhập vào trùng khớp 100% với mật khẩu cũ trong DB
                    if (newPasswordTrimmed == existingUser.PasswordHash)
                    {
                        ViewBag.ValidationError = "Mật khẩu mới không được trùng với mật khẩu cũ hiện tại của tài khoản!";
                        return View(user);
                    }

                    // Nếu không trùng, gán mật khẩu mới vào thực thể để cập nhật
                    user.PasswordHash = newPasswordTrimmed;
                }
                else
                {
                    // Nếu bỏ trống, giữ nguyên mật khẩu cũ từ DB để tránh mất dữ liệu
                    user.PasswordHash = existingUser.PasswordHash;
                }

                _context.Update(user);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ViewBag.ValidationError = "Đã xảy ra lỗi hệ thống trong quá trình cập nhật.";
                return View(user);
            }
        }

        // ===================================================
        // 4. CHỨC NĂNG: XÓA TÀI KHOẢN (DELETE)
        // ===================================================
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