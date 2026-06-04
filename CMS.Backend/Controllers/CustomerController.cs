/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 8.6 - Bộ điều hướng Quản lý Khách hàng (Customer) tích hợp kiểm soát quyền hạn và check đơn hàng liên kết
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả tài khoản "Quản trị viên" và "Editor" đều được quyền truy cập vào phân hệ này
    [Authorize(Roles = "Quản trị viên,Editor")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm kết nối cơ sở dữ liệu vào Controller của Khoa
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH KHÁCH HÀNG (INDEX)
        // ===================================================
        [HttpGet]
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách khách hàng từ SQL Server, xếp cái mới đăng ký lên đầu
            var data = _context.Customers.OrderByDescending(c => c.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: CHỈNH SỬA THÔNG TIN KHÁCH HÀNG (EDIT)
        // ===================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                // Cập nhật thông tin sửa đổi từ admin xuống DB
                _context.Update(customer);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        // ====================================================================================
        // 3. CHỨC NĂNG: XÓA TÀI KHOẢN KHÁCH HÀNG (DELETE) - KIỂM TRA QUYỀN VÀ RÀNG BUỘC ĐƠN HÀNG
        // ====================================================================================
        public IActionResult Delete(int id)
        {
            // 🔒 BƯỚC CHẶN 1: Nếu tài khoản đang đăng nhập là Editor thì tuyệt đối không được xóa
            if (User.IsInRole("Editor"))
            {
                TempData["DeleteError"] = "Tài khoản của bạn thuộc nhóm quyền biên tập viên (Editor), không có thẩm quyền thực hiện thao tác xóa dữ liệu khách hàng này!";
                return RedirectToAction("Index");
            }

            // 🔒 BƯỚC CHẶN 2: Kiểm tra xem khách hàng này đã từng phát sinh đơn hàng nào chưa (Tránh lỗi Cascade phá hủy database)
            var hasOrders = _context.Orders != null && _context.Orders.Any(o => o.CustomerId == id);
            if (hasOrders)
            {
                TempData["DeleteError"] = "Không thể xóa khách hàng này! Vì tài khoản này đang liên kết với các Đơn hàng/Hóa đơn tồn tại trong hệ thống.";
                return RedirectToAction("Index");
            }

            // BƯỚC 3: Nếu an toàn vượt qua 2 bước trên, tiến hành xóa khách hàng chưa mua hàng lần nào
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                try
                {
                    _context.Customers.Remove(customer);
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    TempData["DeleteError"] = "Đã xảy ra lỗi hệ thống trong quá trình thực thi lệnh xóa dữ liệu!";
                }
            }
            return RedirectToAction("Index");
        }
    }
}