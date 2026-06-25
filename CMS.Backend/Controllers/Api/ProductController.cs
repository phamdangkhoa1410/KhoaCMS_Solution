/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Product/paged?page=1&pageSize=12
        [HttpGet("paged")]
        public async Task<IActionResult> GetPagedProducts(int page = 1, int pageSize = 5)
        {
            var totalItems = await _context.Products.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var products = await _context.Products
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    stockQuantity = p.StockQuantity
                })
                .ToListAsync();

            return Ok(new
            {
                data = products,
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalItems = totalItems,
                    totalPages = totalPages
                }
            });
        }

        // GET: api/Product/top-selling
        [HttpGet("top-selling")]
        public async Task<IActionResult> GetTopSellingProducts()
        {
            var topSellingIds = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(od => od.Quantity) })
                .OrderByDescending(x => x.TotalSold)
                .Take(3)
                .Select(x => x.ProductId)
                .ToListAsync();

            var topProducts = await _context.Products
                .Where(p => topSellingIds.Contains(p.Id))
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    stockQuantity = p.StockQuantity
                })
                .ToListAsync();

            return Ok(topProducts);
        }

        // GET: api/Product/filter?minPrice=1000000&maxPrice=20000000&page=1&pageSize=12
        [HttpGet("filter")]
        public async Task<IActionResult> FilterProducts(decimal minPrice = 0, decimal maxPrice = 999999999, int page = 1, int pageSize = 5)
        {
            var query = _context.Products.Where(p => p.Price >= minPrice && p.Price <= maxPrice);

            var totalItems = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    stockQuantity = p.StockQuantity
                })
                .ToListAsync();

            return Ok(new
            {
                data = products,
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalItems = totalItems,
                    totalPages = totalPages
                }
            });
        }

        // GET: api/Product/search?keyword=laptop&page=1&pageSize=12
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(string keyword, int page = 1, int pageSize = 5)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return Ok(new { data = new object[] { }, pagination = new { currentPage = 1, totalPages = 0 } });
            }

            var query = _context.Products.Where(p => p.Name.Contains(keyword));

            var totalItems = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    stockQuantity = p.StockQuantity
                })
                .ToListAsync();

            return Ok(new
            {
                data = products,
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalItems = totalItems,
                    totalPages = totalPages
                }
            });
        }
        // GET: api/Product/advanced-search?keyword=...&categoryId=...&minPrice=...&maxPrice=...&page=1&pageSize=12
        [HttpGet("advanced-search")]
        public async Task<IActionResult> AdvancedSearch(
            string keyword = "", 
            int? categoryId = null, 
            decimal minPrice = 0, 
            decimal maxPrice = 999999999, 
            int page = 1, 
            int pageSize = 5)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword));
            }

            if (categoryId.HasValue && categoryId.Value > 0)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }

            query = query.Where(p => p.Price >= minPrice && p.Price <= maxPrice);

            var totalItems = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Include(p => p.CategoryProduct)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    stockQuantity = p.StockQuantity,
                    categoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Laptop"
                })
                .ToListAsync();

            return Ok(new
            {
                data = products,
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalItems = totalItems,
                    totalPages = totalPages
                }
            });
        }
    }
}
