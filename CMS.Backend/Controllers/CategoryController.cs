/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Version 1.0
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
            // Truy vấn lấy toàn bộ dữ liệu THẬT từ bảng Categories trong SQL Server và chuyển thành List
            var data = _context.Categories.ToList();

            // Trả về View danh sách và truyền kèm dữ liệu vừa lấy được sang giao diện hiển thị
            return View(data);
        }

        // ==========================================
        // 2. CHỨC NĂNG: THÊM MỚI DANH MỤC
        // ==========================================

        // [GET] Hiển thị giao diện Form để người dùng nhập thông tin danh mục mới
        public IActionResult Create() => View();

        // [POST] Tiếp nhận thông tin từ Form gửi lên và tiến hành lưu vào Cơ sở dữ liệu
        [HttpPost]
        public IActionResult Create(Category category)
        {
            // Thêm đối tượng category mới vào tập hợp dữ liệu theo dõi của Entity Framework
            _context.Categories.Add(category);

            // Thực thi lệnh lưu thay đổi, chính thức đẩy dữ liệu mới xuống bảng SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, điều hướng người dùng quay trở lại trang danh sách (Index)
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3. CHỨC NĂNG: SỬA THÔNG TIN DANH MỤC
        // ==========================================

        // [GET] Tìm danh mục cần sửa theo mã ID và hiển thị thông tin cũ lên Form
        public IActionResult Edit(int id)
        {
            // Sử dụng hàm Find để tìm kiếm nhanh bản ghi trong bảng Categories dựa vào khóa chính ID
            var category = _context.Categories.Find(id);

            // Trả về View chỉnh sửa cùng với dữ liệu của danh mục tìm thấy
            return View(category);
        }

        // [POST] Tiếp nhận thông tin đã thay đổi từ Form và tiến hành cập nhật vào Database
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            // Đánh dấu bản ghi này đã được thay đổi thông tin
            _context.Update(category);

            // Lưu các thay đổi vừa cập nhật xuống cơ sở dữ liệu SQL Server
            _context.SaveChanges();

            // Điều hướng quay lại trang danh sách sau khi cập nhật thành công
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. CHỨC NĂNG: XÓA DANH MỤC
        // ==========================================
        public IActionResult Delete(int id)
        {
            // Tìm kiếm đối tượng danh mục cần xóa trong Database dựa vào ID được truyền tới
            var category = _context.Categories.Find(id);

            // Kiểm tra xem danh mục đó có tồn tại hay không nhằm tránh lỗi hệ thống
            if (category != null)
            {
                // Thực hiện lệnh xóa đối tượng danh mục ra khỏi tập hợp dữ liệu
                _context.Categories.Remove(category);

                // Lưu lại thay đổi để SQL Server chính thức xóa bản ghi này
                _context.SaveChanges();
            }

            // Quay trở lại trang danh sách sau khi thực hiện xong thao tác xóa
            return RedirectToAction("Index");
        }
    }
}