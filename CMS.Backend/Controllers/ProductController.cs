/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 8.1 - Bộ điều hướng CRUD Sản phẩm đồng bộ chuỗi phân quyền chuẩn theo Database thực tế
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // BƯỚC KHAI BÁO: Nhúng thư viện bảo mật hệ thống
using CMS.Data;
using CMS.Data.Entities;
using System.IO;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Ổ KHÓA TỔNG: Cả tài khoản "Quản trị viên" và "Editor" đều được quyền truy cập vào phân hệ này
    [Authorize(Roles = "Quản trị viên,Editor")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: XEM DANH SÁCH SẢN PHẨM (INDEX)
        // ===================================================
        public IActionResult Index()
        {
            // Lấy danh sách sản phẩm nạp kèm thông tin bảng danh mục liên kết (Include)
            var data = _context.Products.Include(p => p.CategoryProduct).OrderByDescending(p => p.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: THÊM MỚI SẢN PHẨM (CREATE)
        // ===================================================
        public IActionResult Create()
        {
            // Đẩy danh sách danh mục sản phẩm vào Dropdown
            ViewBag.CategoryProducts = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product product, IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                var filePath = Path.Combine(uploadFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(fileStream);
                }

                product.ImageUrl = "/uploads/" + uniqueFileName;
            }

            _context.Products.Add(product);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA SẢN PHẨM (EDIT)
        // ===================================================
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.CategoryProducts = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        [HttpPost]
        public IActionResult Edit(Product product, IFormFile? imageFile)
        {
            try
            {
                var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == product.Id);
                if (existingProduct == null) return NotFound();

                if (imageFile != null && imageFile.Length > 0)
                {
                    var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    var filePath = Path.Combine(uploadFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    product.ImageUrl = "/uploads/" + uniqueFileName;

                    // Xóa file ảnh vật lý cũ trên máy để tránh rác server
                    if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                    {
                        var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingProduct.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                }
                else
                {
                    // Nếu Khoa không chọn file ảnh mới, giữ nguyên đường dẫn ảnh cũ của sản phẩm đó
                    product.ImageUrl = existingProduct.ImageUrl;
                }

                _context.Update(product);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ViewBag.CategoryProducts = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);
                return View(product);
            }
        }

        // ====================================================================================
        // 4. CHỨC NĂNG: XÓA SẢN PHẨM (DELETE) - PHÂN QUYỀN CHẶN CỨNG EDITOR
        // ====================================================================================
        // Ổ KHÓA RIÊNG BIỆT: Đè lên ổ khóa tổng, chỉ duy nhất tài khoản có quyền "Quản trị viên" mới được chạy hàm này.
        // Tài khoản "Editor" nếu cố tình gọi URL /Product/Delete sẽ lập tức bị hệ thống chặn lại và trả về AccessDenied!
        [Authorize(Roles = "Quản trị viên")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Xóa file ảnh vật lý khỏi thư mục wwwroot trước khi xóa bản ghi dữ liệu
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}