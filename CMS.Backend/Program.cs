/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 6.0 - Buổi 6: Cấu hình kiến trúc lai Hybrid (Sửa đổi theo từng bước thực hành)
 */

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using CMS.Data;
using System.Security.Claims;

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
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.Cookie.Name = ".AspNetCore.Cookies";
    });

// [BUỔI 6]: Lệnh này vừa nhận diện các API mới, vừa giữ quyền biên dịch các View (.cshtml) của Web MVC cũ
builder.Services.AddControllersWithViews();

// [BUỔI 6]: Đăng ký dịch vụ lõi giúp hệ thống tự động bóc tách thông tin Endpoint phục vụ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // -- Kích hoạt bộ sinh tài liệu API Swagger

// [BUỔI 6 - PHẦN 4]: Đăng ký chính sách CORS (Cho phép ReactJS kết nối rút dữ liệu ở Buổi 7)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// [BUỔI 6]: KÍCH HOẠT MIDDLEWARE HIỂN THỊ SWAGGER UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "KhoaCMS Web API v1");
    c.RoutePrefix = "swagger"; // -- Đường dẫn truy cập mặc định sẽ là /swagger
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// [BUỔI 6 - VỊ TRÍ ĐẶT CORS]: Phải nằm ngay giữa UseRouting và app.UseAuthentication()
app.UseCors("AllowAll");

// --- BƯỚC 3: SẮP XẾP THỨ TỰ VÀNG MIDLLEWARE BẢO MẬT HỆ THỐNG ---
app.UseAuthentication();
app.UseAuthorization();

// ===============================================================
// --- [BUỔI 6]: KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP) ---
// ===============================================================

// Phân luồng A: Ánh xạ các Endpoint API tuân thủ theo cấu trúc [Route("api/[controller]")]
app.MapControllers();

// Phân luồng B: Giữ lại bản đồ đường đi mặc định cho trang giao diện Web MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();