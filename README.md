# 💻 KHOA LAPTOP MANAGEMENT SYSTEM (E-Commerce & CMS)

> **Đồ án môn học:** Phát triển ứng dụng Web / Công nghệ phần mềm
> **Trường Cao Đẳng Công Thương TP.HCM (HITC)**
> **Mô hình kiến trúc:** Hybrid Architecture (ASP.NET Core MVC + Web API) & SPA (ReactJS)

![Project Status](https://img.shields.io/badge/Status-Completed_Full_8_Chapters-success) ![Backend](https://img.shields.io/badge/Backend-ASP.NET_Core_8-512BD4) ![Frontend](https://img.shields.io/badge/Frontend-React_18-61DAFB) ![Database](https://img.shields.io/badge/Database-SQL_Server-CC292B)

---

## 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Phạm Đăng Khoa
* **Mã số sinh viên (MSSV):** 2123110058
* **Lớp:** CCQ2311B
* **Năm thực hiện:** 2026

---

## 🚀 TIẾN ĐỘ HOÀN THIỆN TOÀN TẬP (TỪ BUỔI 1 ĐẾN BUỔI 8)

Hệ thống đã trải qua 8 giai đoạn phát triển toàn diện, đi từ cấu trúc dữ liệu nền tảng cho đến khi giao diện front-end bóng bẩy tương tác theo thời gian thực:

### 🔹 Buổi 1 & 2: Khởi tạo Giải pháp Đa tầng & Entity Framework Core
* Bóc tách Solution thành các dự án độc lập: `CMS.Data` (Xử lý DB) và `CMS.Backend` (Web Controller).
* Khởi tạo **8 Thực thể cốt lõi**: `Category`, `Post`, `User` (cho CMS) và `CategoryProduct`, `Product`, `Customer`, `Order`, `OrderDetail` (cho E-Commerce).
* Thực thi Code-First Migration (`Update-Database`) tạo lược đồ CSDL chuẩn hóa trên SQL Server.

### 🔹 Buổi 3 & 4: Xây dựng Trang Quản trị Hệ thống (Admin CRUD)
* Phát triển bộ điều khiển ASP.NET Core MVC cho việc Thêm/Sửa/Xóa/Xem: `Category`, `Post`, `User`.
* Tích hợp Tailwind CSS và Bootstrap Icons, mang lại trải nghiệm nhập liệu sạch sẽ cho người quản trị.

### 🔹 Buổi 5: Bảo mật Cookie Authentication & Phân Quyền (Role-based)
* Thiết lập **Cookie Authentication** trong hệ thống Middleware của `Program.cs`.
* Khóa an ninh hệ thống bằng Attribute `[Authorize]`. 
* Phân luồng quyền lực rõ ràng: Quyền `Editor` chỉ được cập nhật bài viết, quyền `Admin` nắm giữ toàn bộ hệ thống (Users/Roles). Trả về lỗi `403 Access Denied` cực kỳ chuyên nghiệp.

### 🔹 Buổi 6: Kiến trúc Lai Hybrid (MVC + RESTful API) & Swagger
* Cài đặt `Swashbuckle.AspNetCore` để khởi tạo cổng tài liệu **Swagger UI**.
* Xây dựng loạt API Endpoint trả JSON thô tốc độ cao (`/api/products`, `/api/posts`, `/api/orders`).
* Mở khóa cấu hình bảo mật **CORS Policy (AllowAll)** để cho phép ReactJS gọi API từ cổng khác.

### 🔹 Buổi 7: Khởi tạo SPA ReactJS (Frontend) & Axios Call
* Tạo dự án `cms.frontend` bằng Create React App (CRA).
* Thiết lập `AxiosClient` và quản lý trạng thái bằng **Context API** (AuthContext).
* Hoàn thiện luồng Đăng ký / Đăng nhập khách hàng song song với việc hiển thị kho Sản phẩm và trang Blog tin tức.

### 🔹 Buổi 8: Premium UI/UX Upgrade & Luồng Thanh Toán (Checkout) Hoàn Hảo
* **Nâng cấp giao diện (Premium Glassmorphism)**: Thẻ sản phẩm bóng đổ 3D, nút bấm Gradient bốc lửa, hiệu ứng hover mượt mà và Typography cực kỳ hiện đại.
* Hoàn thiện **Giỏ hàng (Cart)** và luồng **Mua ngay (Buy Now)** thẳng tiến trang thanh toán.
* Phát triển trang **Lịch sử Đơn hàng (Order History)** load hình ảnh sản phẩm động và trạng thái đơn hàng thời gian thực.
* Xử lý cực kỳ chặt chẽ logic Check số lượng tồn kho (Stock) từ SQL Server.

---

## 🛠️ CÔNG NGHỆ ÁP DỤNG
* **Backend Framework:** ASP.NET Core 8.0 (Kiến trúc lai Hybrid Web MVC + RESTful Web API)
* **Database ORM:** Entity Framework Core (Code First Migration)
* **Database Server:** Microsoft SQL Server
* **API Documentation:** Swagger UI & Postman
* **Frontend Framework:** React 18 (CRA) + React Router v6
* **UI/UX Styling:** CSS3 Premium Glassmorphism, Bootstrap 4/5, Bootstrap Icons
* **Security:** Cookie Authentication, JWT Auth Concept & CORS Policy

---

## 📁 CẤU TRÚC CÂY THƯ MỤC CHI TIẾT ĐẦY ĐỦ

Dưới đây là sơ đồ cây thư mục hoàn chỉnh thể hiện sự đồ sộ và logic chặt chẽ của hệ thống:

```text
D:\KHOACMS_SOLUTION
├── KhoaCMS_Solution.sln         (File quản trị tổng thể Visual Studio)
│
├── CMS.Data/                    (LỚP TRUNG TÂM DỮ LIỆU)
│   ├── Entities/                (8 Models cốt lõi)
│   │   ├── Banner.cs
│   │   ├── Category.cs
│   │   ├── CategoryProduct.cs
│   │   ├── Customer.cs
│   │   ├── Order.cs
│   │   ├── OrderDetail.cs
│   │   ├── Post.cs
│   │   ├── Product.cs
│   │   └── User.cs
│   ├── Migrations/              (Lịch sử kết xuất cơ sở dữ liệu EF Core)
│   └── ApplicationDbContext.cs  (Trạm kiểm soát ánh xạ Entity Framework)
│
├── CMS.Backend/                 (LỚP ĐIỀU CHẾ LOGIC & ADMIN MVC & API)
│   ├── Controllers/             (Các bộ điều khiển)
│   │   ├── AccountController.cs (Đăng nhập Admin)
│   │   ├── BannerController.cs  
│   │   ├── CategoryController.cs
│   │   ├── CustomerController.cs
│   │   ├── OrderController.cs
│   │   ├── PostController.cs
│   │   ├── ProductController.cs
│   │   ├── UserController.cs
│   │   └── Api/                 (Phân hệ Endpoint RESTful Web API)
│   │       ├── CustomerController.cs
│   │       ├── OrderController.cs
│   │       ├── PostController.cs
│   │       ├── ProductController.cs
│   │       └── ...
│   ├── Views/                   (Giao diện Razor MVC quản trị Admin)
│   │   ├── Account/             (Login/AccessDenied)
│   │   ├── Category/
│   │   ├── Product/
│   │   ├── Order/
│   │   ├── Shared/              (_Layout.cshtml, Error.cshtml)
│   │   └── ...
│   ├── appsettings.json         (Chuỗi kết nối SQL Server Connection String)
│   └── Program.cs               (Trạm nhúng Dependency Injection, CORS, Authentication)
│
└── cms.frontend/                (LỚP ỨNG DỤNG CLIENT REACT SPA)
    ├── package.json
    └── src/
        ├── api/
        │   └── axiosClient.js   (Cấu hình Interceptors, BaseUrl)
        ├── components/
        │   └── ProductCard.jsx  (Thẻ sản phẩm Premium dùng chung)
        ├── context/
        │   └── AuthContext.js   (Quản lý trạng thái Đăng nhập User toàn cục)
        ├── layout/
        │   ├── Header.jsx       (Thanh Menu điều hướng)
        │   ├── Footer.jsx
        │   ├── Banner.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/               (Tập hợp các Trang chức năng chính)
        │   ├── auth/            (Login.jsx, Register.jsx, ForgotPassword.jsx)
        │   ├── blog/            (PostList.jsx, BlogCategoryList.jsx)
        │   ├── blog-detail/     (Chi tiết bài viết)
        │   ├── cart/            (Cart.jsx, Checkout.jsx)
        │   ├── customer/        (Profile.jsx, Orders.jsx - Lịch sử mua hàng)
        │   ├── home/            (Trang chủ Premium)
        │   ├── product-detail/  (Chi tiết Cấu hình phần cứng)
        │   └── shop/            (ProductList.jsx - Bộ lọc Advanced Filter)
        ├── services/            (Lớp gọi API theo từng phân hệ)
        │   ├── authService.js
        │   ├── orderService.js
        │   ├── productService.js
        │   └── ...
        ├── App.js               (Bản đồ Điều hướng Router)
        └── index.css            (Bách khoa toàn thư CSS Premium Glassmorphism)
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
1. Mở Terminal (Command Prompt) và chuyển hướng (`cd`) vào thư mục `cms.frontend`.
2. Chạy lệnh cài đặt thư viện: `npm install`
3. Chạy lệnh khởi động máy chủ React: `npm start`
4. Trình duyệt sẽ tự động mở trang web giao diện siêu đẹp tại `http://localhost:3000/`.
