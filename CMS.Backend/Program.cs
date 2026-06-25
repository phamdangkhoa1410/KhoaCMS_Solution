/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 7.7 - Khóa cứng và đồng bộ chuẩn chỉnh theo cổng mặc định Port 3000 của ReactJS
 */

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using CMS.Data;
using CMS.Backend.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký Memory Cache cho OTP
builder.Services.AddMemoryCache();

// Đăng ký dịch vụ Gửi Mail
builder.Services.AddScoped<IEmailService, EmailService>();

// --- BƯỚC 1: ĐĂNG KÝ DBCONTEXT VÀO HỆ THỐNG ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- BƯỚC 2: KHAI BÁO DỊCH VỤ XÁC THỰC COOKIE THEO YÊU CẦU BUỔI 5 ---
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.Cookie.Name = ".AspNetCore.Cookies";
    });

// [BUỔI 6]: Nhận diện các API mới và giữ quyền biên dịch các View (.cshtml) Web MVC cũ
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Kích hoạt bộ sinh tài liệu API Swagger

// ==================================================================================
// --- [BUỔI 7]: ĐĂNG KÝ CHÍNH SÁCH CORS CHUẨN ĐÚNG THEO CỔNG 3000 GỐC               ---
// ==================================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Đã khóa cứng về lại cổng mặc định 3000
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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
    c.RoutePrefix = "swagger"; // Đường dẫn truy cập mặc định sẽ là /swagger
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// ====================================================================================
// --- [BUỔI 7 - XỬ LÝ SỰ CỐ]: ĐÁNH CHẶN REQUEST OPTIONS ĐỒNG BỘ CHUẨN CỔNG 3000        ---
// ====================================================================================
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000"); // Đồng bộ về 3000
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});

// --- [BUỔI 7]: KÍCH HOẠT CORS ĐÚNG VỊ TRÍ VÀNG ---
app.UseCors("AllowReactApp");

// --- BƯỚC 3: MIDDLEWARE BẢO MẬT HỆ THỐNG ---
app.UseAuthentication();
app.UseAuthorization();

// --- [BUỔI 6]: KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG ---
app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();