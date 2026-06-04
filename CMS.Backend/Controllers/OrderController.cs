/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 8.5 - Bộ điều hướng Sổ đơn hàng kết hợp tích hợp Xem chi tiết OrderDetail và kiểm soát lỗi
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
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH ĐƠN HÀNG (INDEX)
        // ===================================================
        [HttpGet]
        public IActionResult Index()
        {
            var data = _context.Orders
                               .Include(o => o.Customer)
                               .OrderByDescending(o => o.Id)
                               .ToList();
            return View(data);
        }

        // ===================================================
        // 1.2. CHỨC NĂNG: XEM CHI TIẾT ĐƠN HÀNG (DETAILS)
        // ===================================================
        [HttpGet]
        public IActionResult Details(int id)
        {
            // Tìm thông tin đơn hàng gốc kèm theo thông tin của Khách hàng sở hữu
            var order = _context.Orders
                                .Include(o => o.Customer)
                                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            // Truy vấn lấy toàn bộ danh sách sản phẩm nằm trong đơn hàng này (Include Product để lấy tên/ảnh)
            var details = _context.OrderDetails
                                  .Include(od => od.Product)
                                  .Where(od => od.OrderId == id)
                                  .ToList();

            // Đẩy danh sách chi tiết hóa đơn qua ViewBag để hứng dữ liệu ngoài View Details.cshtml
            ViewBag.OrderDetails = details;

            return View(order);
        }

        // ===================================================
        // 2. CHỨC NĂNG: CẬP NHẬT TIẾN TRÌNH ĐƠN HÀNG (EDIT)
        // ===================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Include(o => o.Customer).FirstOrDefault(o => o.Id == id);
            if (order == null) return NotFound();

            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order order)
        {
            // Vì không cho sửa thông tin khách hàng, ta chỉ cập nhật Trạng thái và Ghi chú điều phối
            var existingOrder = _context.Orders.Find(order.Id);
            if (existingOrder == null) return NotFound();

            existingOrder.Status = order.Status;
            existingOrder.Notes = order.Notes;

            _context.Update(existingOrder);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ====================================================================================
        // 3. CHỨC NĂNG: XÓA ĐƠN HÀNG (DELETE) - CHẶN Editor VÀ CHECK CHI TIẾT ĐƠN HÀNG
        // ====================================================================================
        public IActionResult Delete(int id)
        {
            // 🔒 BƯỚC CHẶN 1: Nếu tài khoản đang thao tác là Editor, đá về Index gán thông báo lỗi quyền hạn
            if (User.IsInRole("Editor"))
            {
                TempData["DeleteError"] = "Tài khoản của bạn thuộc nhóm quyền biên tập viên (Editor), không có thẩm quyền thực hiện thao tác xóa hóa đơn này khỏi hệ thống!";
                return RedirectToAction("Index");
            }

            // 🔒 BƯỚC CHẶN 2: Nếu đơn hàng đang chứa sản phẩm chi tiết dính dáng khóa ngoại, chặn lại ngay
            var hasDetails = _context.OrderDetails != null && _context.OrderDetails.Any(od => od.OrderId == id);
            if (hasDetails)
            {
                TempData["DeleteError"] = "Không thể xóa đơn hàng này! Vì đơn hàng đang chứa các thông tin sản phẩm chi tiết hóa đơn bên trong mục OrderDetail.";
                return RedirectToAction("Index");
            }

            // BƯỚC 3: Admin thực thi lệnh xóa đối với đơn hàng trống an toàn
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                try
                {
                    _context.Orders.Remove(order);
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    TempData["DeleteError"] = "Đã xảy ra lỗi hệ thống trong quá trình thực thi lệnh xóa đơn hàng!";
                }
            }
            return RedirectToAction("Index");
        }
    }
}