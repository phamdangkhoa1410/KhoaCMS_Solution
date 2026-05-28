/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 5.3 - Hoàn thiện Phân quyền chi tiết (Role-based) cho Category theo kịch bản của Thầy
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // BƯỚC KHAI BÁO: Nhúng thư viện bảo mật hệ thống
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả khoản "Quản trị viên" và "Editor" đều được quyền truy cập vào phân hệ này
    [Authorize(Roles = "Quản trị viên,Editor")]
    public class CategoryController : Controller
    {
        // Khai báo đối tượng đại diện cho Cơ sở dữ liệu (Database Context)
        private readonly ApplicationDbContext _context;

        // Constructor: Sử dụng Dependency Injection để "tiêm" kết nối Database vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. CHỨC NĂNG: TRANG DANH SÁCH DANH MỤC
        // ==========================================
        public IActionResult Index()
        {
            // Truy vấn lấy toàn bộ dữ liệu THẬT từ bảng Categories trong SQL Server
            var data = _context.Categories.OrderByDescending(c => c.Id).ToList();

            // Trả về View danh sách và truyền kèm dữ liệu sang giao diện hiển thị
            return View(data);
        }

        // ==========================================
        // 2. CHỨC NĂNG: THÊM MỚI DANH MỤC
        // ==========================================

        // [GET] Hiển thị giao diện Form để người dùng nhập thông tin danh mục mới
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // [POST] Tiếp nhận thông tin từ Form gửi lên và tiến hành lưu vào Cơ sở dữ liệu
        [HttpPost]
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();

            // Sau khi lưu thành công, điều hướng người dùng quay trở lại trang danh sách (Index)
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3. CHỨC NĂNG: SỬA THÔNG TIN DANH MỤC
        // ==========================================

        // [GET] Tìm danh mục cần sửa theo mã ID và hiển thị thông tin cũ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);

            // ĐỒNG BỘ THEO BÀI HỌC: Kiểm tra nếu không tìm thấy danh mục (tránh lỗi màn hình trắng)
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // [POST] Tiếp nhận thông tin đã thay đổi từ Form và tiến hành cập nhật vào Database
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            _context.Update(category);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. CHỨC NĂNG: XÓA DANH MỤC (PHÂN QUYỀN CAO CẤP)
        // ==========================================
        // Ổ KHÓA RIÊNG BIỆT: Đè lên ổ khóa tổng, chỉ duy nhất tài khoản có quyền "Quản trị viên" mới được chạy hàm này.
        // Tài khoản "Editor" nếu cố tình bấm vào nút Xóa hoặc gọi URL /Category/Delete sẽ lập tức bị hệ thống đá văng sang trang AccessDenied!
        [Authorize(Roles = "Quản trị viên")]
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm kiếm đối tượng danh mục cần xóa trong Database dựa vào ID
            var category = _context.Categories.Find(id);

            // Kiểm tra xem danh mục đó có tồn tại hay không nhằm tránh lỗi hệ thống
            if (category != null)
            {
                try
                {
                    // Bước 2: Thực hiện lệnh xóa đối tượng danh mục ra khỏi bộ nhớ tạm
                    _context.Categories.Remove(category);

                    // Bước 3: Chốt phiên làm việc - EF Core tạo câu lệnh DELETE gửi xuống SQL Server
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    // LƯU Ý QUAN TRỌNG THEO YÊU CẦU: Khóa ngoại ràng buộc (Nếu danh mục đang chứa bài viết)
                    TempData["DeleteError"] = "Không thể xóa danh mục này! Vì danh mục đang có chứa các Bài viết bên trong. Vui lòng xóa hết bài viết thuộc danh mục này trước.";
                }
            }

            // Quay trở lại trang danh sách sau khi thực hiện xong thao tác xóa
            return RedirectToAction("Index");
        }
    }
}