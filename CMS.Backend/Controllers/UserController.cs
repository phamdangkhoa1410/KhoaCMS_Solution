/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 3.5 - Hoàn thiện UserController (Tối ưu hóa chỉnh sửa không mất mật khẩu cũ)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Khai báo đối tượng kết nối và làm việc với Cơ sở dữ liệu (ApplicationDbContext)
        private readonly ApplicationDbContext _context;

        // Constructor: Tiêm (Inject) cơ sở dữ liệu vào Controller thông qua cơ chế Dependency Injection
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH NGƯỜI DÙNG (INDEX)
        // ===================================================
        public IActionResult Index()
        {
            // Truy vấn toàn bộ danh sách tài khoản người dùng từ bảng Users trong SQL Server.
            // Sắp xếp theo Id giảm dần để tài khoản mới tạo hiển thị lên vị trí đầu tiên.
            var data = _context.Users.OrderByDescending(u => u.Id).ToList();

            // Trả về giao diện Index.cshtml kèm theo danh sách dữ liệu vừa lấy được
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: TẠO TÀI KHOẢN MỚI (CREATE)
        // ===================================================

        // [GET] Hiển thị Form để nhập thông tin tài khoản mới (Username, Password, FullName, Role)
        public IActionResult Create()
        {
            return View();
        }

        // [POST] Tiếp nhận thông tin từ Form gửi lên và thực hiện lưu vào hệ thống
        [HttpPost]
        public IActionResult Create(User user)
        {
            // GHI CHÚ QUAN TRỌNG: Trong thực tế cần mã hóa mật khẩu bằng BCrypt hoặc MD5.
            // Hiện tại dự án đang lưu mật khẩu thô (Plain Text) vào cột PasswordHash để bạn Khoa dễ dàng test dữ liệu.
            _context.Users.Add(user);

            // Xác nhận lưu thông tin người dùng mới xuống Database SQL Server
            _context.SaveChanges();

            // Quay trở lại trang danh sách người dùng sau khi tạo thành công
            return RedirectToAction("Index");
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA TÀI KHOẢN (EDIT)
        // ===================================================

        // [GET] Lấy thông tin tài khoản cũ thông qua tham số id và đẩy lên Form sửa
        public IActionResult Edit(int id)
        {
            // Dùng hàm Find() tìm kiếm tài khoản dựa vào Khóa chính (Id)
            var user = _context.Users.Find(id);

            // Nếu không tìm thấy người dùng (gõ sai id trên URL), trả về giao diện lỗi 404 (NotFound)
            if (user == null) return NotFound();

            // Trả về giao diện Edit.cshtml cùng với thông tin người dùng được tìm thấy
            return View(user);
        }

        // [POST] Tiếp nhận các thông tin cập nhật từ Form và xử lý chống mất Mật khẩu
        [HttpPost]
        public IActionResult Edit(User user)
        {
            try
            {
                // 1. Truy vấn thông tin người dùng cũ hiện tại đang nằm trong Database để so sánh mật khẩu
                // (Sử dụng AsNoTracking để tránh xung đột theo vết thực thể của Entity Framework)
                var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
                if (existingUser == null) return NotFound();

                // 2. XỬ LÝ LOGIC AN TOÀN MẬT KHẨU:
                // Nếu ở form sửa, Khoa bỏ trống ô mật khẩu (hoặc chuỗi chỉ chứa dấu cách)
                if (string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    // Lấy lại mật khẩu cũ đang lưu trong DB gán vào lại cho đối tượng, tránh bị ghi đè thành null/rỗng
                    user.PasswordHash = existingUser.PasswordHash;
                }
                else
                {
                    // Nếu Khoa có gõ mật khẩu mới vào form, giữ nguyên mật khẩu mới để hệ thống cập nhật đổi mật khẩu
                    user.PasswordHash = user.PasswordHash.Trim();
                }

                // Cập nhật thông tin thực thể người dùng đã xử lý an toàn vào hệ thống
                _context.Update(user);

                // Lưu lại thay đổi mới vào SQL Server
                _context.SaveChanges();

                // Điều hướng người dùng quay trở lại trang danh sách tài khoản
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                // Nếu xảy ra lỗi ngoài ý muốn, trả về lại chính form kèm dữ liệu đã nhập để không bị mất công gõ lại
                return View(user);
            }
        }

        // ===================================================
        // 4. CHỨC NĂNG: XÓA TÀI KHOẢN (DELETE)
        // ===================================================
        public IActionResult Delete(int id)
        {
            // Tìm kiếm thông tin tài khoản cần xóa bằng Id
            var user = _context.Users.Find(id);

            // Kiểm tra điều kiện tồn tại trước khi xóa để tránh lỗi văng hệ thống (NullReferenceException)
            if (user != null)
            {
                // Thực hiện lệnh xóa người dùng khỏi danh sách quản lý của Entity Framework
                _context.Users.Remove(user);

                // Lưu thay đổi để SQL Server chính thức xóa bản ghi này khỏi bảng dữ liệu
                _context.SaveChanges();
            }

            // Quay về lại trang danh sách quản trị người dùng sau khi hoàn tất
            return RedirectToAction("Index");
        }
    }
}