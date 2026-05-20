/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 3.0 - Bộ điều hướng CRUD Danh mục sản phẩm công nghiệp
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
        public IActionResult Index()
        {
            // Lấy danh sách danh mục sản phẩm từ SQL Server, xếp cái mới lên đầu
            var data = _context.CategoriesProducts.OrderByDescending(cp => cp.Id).ToList();
            return View(data);
        }

        // ===================================================
        // 2. CHỨC NĂNG: THÊM MỚI DANH MỤC SẢN PHẨM (CREATE)
        // ===================================================
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

        // ===================================================
        // 4. CHỨC NĂNG: XÓA DANH MỤC SẢN PHẨM (DELETE)
        // ===================================================
        public IActionResult Delete(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct != null)
            {
                _context.CategoriesProducts.Remove(categoryProduct);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}