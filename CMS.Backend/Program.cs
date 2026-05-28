/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 5.5 - Buổi 5: Hoàn thiện cấu hình định dạng Token vai trò cho Cookie Authentication
 */

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using CMS.Data;
using System.Security.Claims; // Cần thêm namespace này để cấu hình đồng bộ Role

var builder = WebApplication.CreateBuilder(args);

// --- BƯỚC 1: ĐĂNG KÝ DBCONTEXT VÀO HỆ THỐNG ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================================================
// --- BƯỚC 2: KHAI BÁO DỊCH VỤ XÁC THỰC COOKIE THEO YÊU CẦU BUỔI 5 ---
// =========================================================================
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // Đường dẫn điều hướng nếu người dùng chưa đăng nhập mà cố vào trang cấm
        options.LoginPath = "/Account/Login";

        // Đường dẫn điều hướng nếu người dùng đăng nhập rồi nhưng sai quyền hạn (Ví dụ: Editor vào mục User)
        options.AccessDeniedPath = "/Account/AccessDenied";

        // Thiết lập Cookie tự động hết hạn sau 60 phút làm việc
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);

        // ĐỒNG BỘ HỆ THỐNG: Ép hệ thống đọc chuỗi phân quyền Role theo đúng dạng chuỗi ký tự tự do trong DB
        options.Cookie.Name = ".AspNetCore.Cookies";
    });

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// =========================================================================
// --- BƯỚC 3: SẮP XẾP THỨ TỰ VÀNG MIDLLEWARE BẢO MẬT HỆ THỐNG ---
// =========================================================================
app.UseAuthentication(); // BƯỚC A: Xác nhận danh tính "Anh là ai?" (Kiểm tra thẻ bài Cookie)
app.UseAuthorization();  // BƯỚC B: Xác nhận quyền hạn "Anh được làm gì?" (Kiểm tra quyền Admin/Editor)

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();