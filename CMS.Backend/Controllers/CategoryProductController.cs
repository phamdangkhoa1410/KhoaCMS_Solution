/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 8.3 - Bản sửa lỗi triệt để: Kiểm tra sản phẩm tồn tại trước khi xóa danh mục
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // BƯỚC KHAI BÁO: Nhúng thư viện bảo mật hệ thống
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả tài khoản "Quản trị viên" và "Editor" đều được quyền truy cập vào phân hệ này
    [Authorize(Roles = "Quản trị viên,Editor")]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm kết nối cơ sở dữ liệu vào Controller của Khoa
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH DANH MỤC SẢN PHẨM (INDEX)
        // ===================================================
        [HttpGet]
        public IActionResult Index()
        {
            // Lấy danh sách danh mục sản phẩm từ SQL Server, xếp cái mới lên đầu
            var data = _context.CategoriesProducts.OrderByDescending(cp => cp.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: THÊM MỚI DANH MỤC SẢN PHẨM (CREATE)
        // ===================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(categoryProduct);
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA DANH MỤC SẢN PHẨM (EDIT)
        // ===================================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct == null) return NotFound();

            return View(categoryProduct);
        }

        [HttpPost]
        public IActionResult Edit(CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.Update(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(categoryProduct);
        }

        // ====================================================================================
        // 4. CHỨC NĂNG: XÓA DANH MỤC SẢN PHẨM (DELETE) - KIỂM TRA QUYỀN VÀ RÀNG BUỘC CHẶT CHẼ
        // ====================================================================================
        public IActionResult Delete(int id)
        {
            // 🔒 BƯỚC CHẶN 1: Kiểm tra nếu tài khoản đăng nhập là Editor thì không cho xóa
            if (User.IsInRole("Editor"))
            {
                TempData["DeleteError"] = "Tài khoản của bạn thuộc nhóm quyền biên tập viên (Editor), không có thẩm quyền thực hiện thao tác xóa danh mục sản phẩm này!";
                return RedirectToAction("Index");
            }

            // 🔒 BƯỚC CHẶN 2: Kiểm tra xem có sản phẩm nào đang sử dụng danh mục này không (Sửa lỗi Cascade Delete của EF Core)
            var hasProducts = _context.Products.Any(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                TempData["DeleteError"] = "Không thể xóa danh mục sản phẩm này! Vì danh mục đang chứa các Sản phẩm bên trong kho. Vui lòng xóa hoặc chuyển hết sản phẩm thuộc danh mục này trước.";
                return RedirectToAction("Index");
            }

            // BƯỚC 3: Nếu an toàn vượt qua 2 bước chặn trên thì mới thực thi lệnh xóa dữ liệu
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct != null)
            {
                try
                {
                    _context.CategoriesProducts.Remove(categoryProduct);
                    _context.SaveChanges();
                }
                catch (Exception)
                {
                    TempData["DeleteError"] = "Đã xảy ra lỗi hệ thống trong quá trình xóa dữ liệu danh mục!";
                }
            }
            return RedirectToAction("Index");
        }
    }
}