/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: CMS.Data/Entities/Banner.cs
 * Chức năng: Thực thể Banner - Ánh xạ dữ liệu banner slider trang chủ xuống bảng SQL Server
 */

using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        /// <summary>Link ảnh banner (URL tuyệt đối hoặc đường dẫn server /uploads/...)</summary>
        [Required(ErrorMessage = "URL ảnh không được để trống")]
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>Tiêu đề chữ chạy hiển thị trên banner slider</summary>
        [StringLength(200)]
        public string? Title { get; set; }

        /// <summary>Mô tả ngắn hiển thị bên dưới tiêu đề</summary>
        [StringLength(500)]
        public string? Description { get; set; }

        /// <summary>Đường dẫn điều hướng khi người dùng bấm vào banner</summary>
        [StringLength(300)]
        public string? Link { get; set; }

        /// <summary>Thứ tự sắp xếp hiển thị (số nhỏ hiển thị trước)</summary>
        public int Position { get; set; } = 0;

        /// <summary>Trạng thái bật/tắt hiển thị banner (true = hiển thị, false = ẩn)</summary>
        public bool Status { get; set; } = true;
    }
}
