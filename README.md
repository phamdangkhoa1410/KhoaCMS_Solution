# 💻 KHOA LAPTOP MANAGEMENT SYSTEM (E-Commerce & CMS)

> **Đồ án môn học:** Phát triển ứng dụng Web / Công nghệ phần mềm
> **Trường Cao Đẳng Công Thương TP.HCM (HITC)**
> **Mô hình kiến trúc:** Hybrid Architecture (ASP.NET Core MVC + Web API) & SPA (ReactJS)

![Project Status](https://img.shields.io/badge/Status-Completed-success) ![Backend](https://img.shields.io/badge/Backend-ASP.NET_Core_8-512BD4) ![Frontend](https://img.shields.io/badge/Frontend-React_18-61DAFB) ![Database](https://img.shields.io/badge/Database-SQL_Server-CC292B)

---

## 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Phạm Đăng Khoa
* **Mã số sinh viên (MSSV):** 2123110058
* **Lớp:** CCQ2311B
* **Năm thực hiện:** 2026

---

## 🚀 TỔNG QUAN HỆ THỐNG ĐÃ XÂY DỰNG

Dự án Khoa Laptop Management System là một giải pháp thương mại điện tử kết hợp quản trị nội dung (CMS) hoàn chỉnh, được thiết kế chuyên biệt cho việc kinh doanh các thiết bị phần cứng tin học (Laptop, PC). Dự án áp dụng phong cách thiết kế **Premium Glassmorphism & Cyber Modern**, mang lại trải nghiệm người dùng (UX/UI) cao cấp nhất.

### 🌟 CÁC TÍNH NĂNG NỔI BẬT ĐÃ HOÀN THIỆN
1. **Giao diện Premium UI/UX:**
   * Hệ thống thẻ (Card) sản phẩm và tin tức tích hợp hiệu ứng đổ bóng sâu (Deep Shadow), nhấc bổng 3D (Hover Translate) và viền dạ quang.
   * Giao diện Responsive 100%, thiết kế theo triết lý *Mobile-first*.
   * Hệ thống nút bấm Gradient đẳng cấp (Mua ngay, Đọc tiếp, Cấu hình).
2. **Hệ thống Lọc nâng cao (Advanced Filter) Real-time:**
   * Bộ lọc giá tiền kéo trượt mượt mà kết hợp từ khóa tìm kiếm và chuyên mục.
   * Lọc bài viết công nghệ kép (Theo tag và Theo tên).
3. **Quản lý Đơn hàng (Order History):**
   * Theo dõi lịch sử mua hàng, tự động hiển thị hình ảnh sản phẩm, trạng thái thanh toán và tổng tiền.
   * Trạng thái đơn hàng phân màu thông minh (Đang chờ, Đã giao, Hủy).
4. **Hệ thống Đăng nhập & Bảo mật Kép:**
   * Xác thực **Cookie Authentication** cho trang quản trị Admin (MVC).
   * Phân quyền Role-based Access Control (Admin / Editor).
5. **Giỏ hàng (Cart) & Thanh toán (Checkout) thông minh:**
   * Nút "Mua ngay" bỏ qua giỏ hàng để bay thẳng đến màn hình thanh toán.
   * Tự động cộng dồn số lượng, tính tổng hóa đơn thời gian thực.

---

## 🛠️ CÔNG NGHỆ ÁP DỤNG
* **Backend Framework:** ASP.NET Core 8.0 (Kiến trúc lai Hybrid Web MVC + RESTful Web API)
* **Database ORM:** Entity Framework Core (Code First Migration)
* **Database Server:** Microsoft SQL Server
* **API Documentation:** Swagger UI
* **Frontend Framework:** React 18 (CRA) + React Router v6
* **UI/UX Styling:** CSS3 Premium Glassmorphism, Bootstrap 4/5, Bootstrap Icons, FontAwesome
* **Security:** Cookie Authentication & CORS Policy

---

## 📁 CẤU TRÚC CÂY THƯ MỤC DỰ ÁN

```text
KhoaCMS_Solution/
├── CMS.Data/                    --> LỚP DỮ LIỆU CỐT LÕI (CLASS LIBRARY)
│   ├── Entities/                --> Định nghĩa 8 mô hình thực thể (Product, Order, Post...)
│   └── ApplicationDbContext.cs  --> Cấu hình ánh xạ Entity Framework
│
├── CMS.Backend/                 --> LỚP BACKEND (ASP.NET CORE 8)
│   ├── Controllers/             --> (MVC) Xử lý giao diện Admin CMS
│   ├── Controllers/Api/         --> (API) Cung cấp dữ liệu JSON cho ReactJS
│   ├── Views/                   --> Kết xuất giao diện quản trị Razor Pages
│   └── Program.cs               --> Cấu hình CORS, Cookie Auth, DI, Swagger
│
└── cms.frontend/                --> LỚP FRONTEND (REACTJS SPA)
    ├── src/
    │   ├── api/                 --> Cấu hình Axios Client
    │   ├── components/          --> Các Component dùng chung (Header, ProductCard, Footer)
    │   ├── pages/               --> Chứa giao diện Shop, Blog, Cart, Checkout, Auth
    │   ├── services/            --> Tương tác gọi API (authService, productService)
    │   └── index.css            --> Chứa toàn bộ Rule CSS Premium (Glassmorphism, Gradient)
```

---

## 📦 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Bước 1: Thiết lập Database (Backend)
1. Mở `appsettings.json` trong `CMS.Backend`, sửa lại chuỗi `DefaultConnection` sao cho khớp với tên Server SQL của bạn.
2. Mở **Package Manager Console**, chọn Default project là `CMS.Data`.
3. Chạy lệnh: `Update-Database` để khởi tạo cấu trúc bảng và dữ liệu mẫu.

### Bước 2: Khởi chạy Backend API (ASP.NET Core)
1. Set `CMS.Backend` làm Startup Project.
2. Nhấn `F5` để chạy. Hệ thống sẽ mở ra ở cổng `https://localhost:7243/`.
3. Kiểm tra API bằng Swagger tại: `https://localhost:7243/swagger`

### Bước 3: Khởi chạy Frontend (ReactJS)
1. Mở Terminal (Command Prompt) và `cd` vào thư mục `cms.frontend`.
2. Chạy lệnh cài đặt thư viện: `npm install`
3. Chạy lệnh khởi động máy chủ React: `npm start`
4. Truy cập giao diện người dùng tại `http://localhost:3000/`.
