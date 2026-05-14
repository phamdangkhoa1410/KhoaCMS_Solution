/*
 * Sinh viên: Phạm Đăng Khoa
 * MSSV: 2123110058
 * Version 1.0 - Cấu hình ApplicationDbContext
 */

using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities; // Đảm bảo bạn đã có các file Entity này trong project

namespace CMS.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor để truyền các thiết lập (ví dụ chuỗi kết nối) từ project Backend sang
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Khai báo các bảng dữ liệu sẽ xuất hiện trong SQL Server
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }

        // Các bảng mở rộng khác theo yêu cầu của bạn
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
    }
}