/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IMemoryCache _cache;

        public CustomerController(ApplicationDbContext context, IEmailService emailService, IMemoryCache cache)
        {
            _context = context;
            _emailService = emailService;
            _cache = cache;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        private Customer GetCustomerFromToken()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                try
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();
                    var decodedToken = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                    var parts = decodedToken.Split(':');
                    if (parts.Length == 2 && int.TryParse(parts[0], out int customerId))
                    {
                        var email = parts[1];
                        return _context.Customers.FirstOrDefault(c => c.Id == customerId && c.Email == email);
                    }
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }

        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var customer = GetCustomerFromToken();
            if (customer == null)
            {
                return Unauthorized(new { message = "Vui lòng đăng nhập để tiếp tục." });
            }

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        public class UpdateProfileRequest
        {
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
        }

        [HttpPut("update-profile")]
        public IActionResult UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var customer = GetCustomerFromToken();
            if (customer == null)
            {
                return Unauthorized(new { message = "Vui lòng đăng nhập để tiếp tục." });
            }

            if (string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest(new { message = "Họ và Tên không được để trống." });
            }

            customer.FullName = request.FullName;
            customer.Phone = request.Phone;
            customer.Address = request.Address;

            _context.Customers.Update(customer);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công!",
                user = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                }
            });
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập Email." });
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Email == request.Email);
            if (customer == null)
            {
                return BadRequest(new { message = "Email không tồn tại trong hệ thống." });
            }

            // Tạo mã OTP 6 số ngẫu nhiên
            string otpCode = new Random().Next(100000, 999999).ToString();

            // Lưu OTP vào MemoryCache với hạn 5 phút. Key là Email của khách
            _cache.Set($"OTP_{customer.Email}", otpCode, TimeSpan.FromMinutes(5));

            var emailHtml = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;'>
                    <div style='background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 20px; text-align: center; color: white;'>
                        <h2>Mã OTP Khôi phục Mật khẩu</h2>
                    </div>
                    <div style='padding: 20px; background-color: #f8fafc;'>
                        <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                        <p>Hệ thống Khoa Laptop Management System vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Mã OTP của bạn là: <span style='font-size: 1.8rem; font-weight: bold; color: #dc2626; letter-spacing: 5px; display: inline-block; padding: 10px; background: #fee2e2; border-radius: 5px;'>{otpCode}</span></p>
                        <hr style='border-top: 1px dashed #cbd5e1; margin: 20px 0;'/>
                        <p style='font-size: 0.9rem; color: #64748b;'>Mã OTP này có hiệu lực trong vòng 5 phút. KHÔNG chia sẻ mã này cho bất kỳ ai.</p>
                    </div>
                </div>";

            await _emailService.SendEmailAsync(customer.Email, "[KHOA-CMS] Mã OTP Khôi phục Mật khẩu", emailHtml);

            return Ok(new { message = "Mã OTP đã được gửi vào Email của bạn. Vui lòng kiểm tra hộp thư." });
        }

        public class VerifyOtpRequest
        {
            public string Email { get; set; }
            public string Otp { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("verify-otp-reset-password")]
        public async Task<IActionResult> VerifyOtpResetPassword([FromBody] VerifyOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin." });
            }

            // Lấy OTP từ Cache
            if (_cache.TryGetValue($"OTP_{request.Email}", out string savedOtp))
            {
                if (savedOtp == request.Otp)
                {
                    // OTP đúng -> Đổi mật khẩu
                    var customer = _context.Customers.FirstOrDefault(c => c.Email == request.Email);
                    if (customer == null)
                    {
                        return BadRequest(new { message = "Lỗi xác thực người dùng." });
                    }

                    // Lưu mật khẩu mới (Đã băm SHA256 để khớp với AuthController)
                    customer.Password = HashPassword(request.NewPassword);
                    _context.Customers.Update(customer);
                    await _context.SaveChangesAsync();

                    // Xóa OTP khỏi cache sau khi dùng thành công
                    _cache.Remove($"OTP_{request.Email}");

                    return Ok(new { message = "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ." });
                }
            }

            return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn." });
        }

        // ============================================================
        // [DEV ONLY] LẤY DANH SÁCH TOÀN BỘ KHÁCH HÀNG
        // ============================================================
        [HttpGet("all")]
        public IActionResult GetAllCustomers()
        {
            var customers = _context.Customers
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address,
                    c.Password // Trả về password hash để dev xem
                })
                .ToList();

            return Ok(new { success = true, data = customers });
        }

        // ============================================================
        // [DEV ONLY] ĐĂNG NHẬP NHANH BẰNG EMAIL (KHÔNG CẦN MẬT KHẨU)
        // ============================================================
        public class EasyLoginRequest
        {
            public string Email { get; set; }
        }

        [HttpPost("easy-login")]
        public IActionResult EasyLogin([FromBody] EasyLoginRequest request)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Email == request.Email);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản với Email này." });
            }

            // Sinh Token đơn giản: Base64(Id:Email) - Y hệt AuthController
            var tokenString = $"{customer.Id}:{customer.Email}";
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenString));

            return Ok(new
            {
                message = "Đăng nhập nhanh thành công!",
                token = token,
                user = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                }
            });
        }
    }
}
