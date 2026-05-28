/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 3.5 - Hoàn thiện CategoryController chuẩn nghiệp vụ Buổi 3 (Bảo vệ ràng buộc dữ liệu)
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
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
            // Truy vấn lấy toàn bộ dữ liệu THẬT từ bảng Categories trong SQL Server
            // Sắp xếp theo Id giảm dần để danh mục mới tạo hiển thị lên vị trí đầu tiên
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
            // BƯỚC 1: Đăng ký - Thêm đối tượng vào tập hợp dữ liệu theo dõi của EF (Bộ nhớ tạm)
            _context.Categories.Add(category);

            // BƯỚC 2: Chốt đơn - Thực thi lệnh lưu thay đổi, đẩy dữ liệu xuống bảng SQL Server
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
            // Sử dụng hàm Find để tìm kiếm nhanh bản ghi trong bảng Categories dựa vào khóa chính ID
            var category = _context.Categories.Find(id);

            // ĐỒNG BỘ THEO BÀI HỌC: Kiểm tra nếu không tìm thấy danh mục (tránh lỗi màn hình trắng)
            if (category == null)
            {
                return NotFound(); // Trả về trang lỗi 404 chuẩn của hệ thống
            }

            // Trả về View chỉnh sửa cùng với dữ liệu của danh mục tìm thấy
            return View(category);
        }

        // [POST] Tiếp nhận thông tin đã thay đổi từ Form và tiến hành cập nhật vào Database
        [HttpPost]
        public IActionResult Edit(Category category)
        {
            // Đánh dấu bản ghi này đã được cập nhật thông tin trong bộ nhớ tạm
            _context.Update(category);

            // Lưu các thay đổi vừa cập nhật xuống cơ sở dữ liệu SQL Server
            _context.SaveChanges();

            // Điều hướng quay lại trang danh sách sau khi cập nhật thành công
            return RedirectToAction("Index");
        }

        // ==========================================
        // 4. CHỨC NĂNG: XÓA DANH MỤC (BẢO VỆ TOÀN VẸN DỮ LIỆU)
        // ==========================================
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
                    // Bắn thông báo lỗi qua TempData để ngoài giao diện hiển thị hộp cảnh báo màu đỏ
                    TempData["DeleteError"] = "Không thể xóa danh mục này! Vì danh mục đang có chứa các Bài viết bên trong. Vui lòng xóa hết bài viết thuộc danh mục này trước.";
                }
            }

            // Quay trở lại trang danh sách sau khi thực hiện xong thao tác xóa
            return RedirectToAction("Index");
        }
    }
}