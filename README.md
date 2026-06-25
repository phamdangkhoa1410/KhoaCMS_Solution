 Markdown
# 🖥️ HỆ THỐNG QUẢN TRỊ NỘI DUNG VÀ THƯƠNG MẠI ĐIỆN TỬ (KHOA-CMS)

> **Đồ án môn học: Phát triển ứng dụng Web / Công nghệ phần mềm**
> **Trường Cao Đẳng Công Thương TP.HCM (HITC)**
> **Báo cáo tiến độ hoàn thiện: Buổi 1 & Buổi 2**

---

## 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Phạm Đăng Khoa
* **Mã số sinh viên (MSSV):** 2123110058
* **Lớp:** CCQ2311B
* **Năm thực hiện:** 2026

---

## 🚀 TIẾN ĐỘ CHI TIẾT ĐÃ HOÀN THÀNH (BUỔI 1 & BUỔI 2)

### 🔹 BUỔI 1: KHỞI TẠO CẤU TRÚC GIẢI PHÁP ĐA LỚP & ĐỊNH NGHĨA THỰC THỂ
* **Khởi tạo Solution tổng thể:** Xây dựng cấu trúc thùng chứa dự án `KhoaCMS_Solution` phân tầng chuyên nghiệp để bóc tách độc lập các lớp xử lý.
* **Xây dựng phân lớp dữ liệu cốt lõi (`CMS.Data`):** Tạo dự án dạng *Class Library* đóng vai trò quản lý mô hình dữ liệu. Triển khai cấu trúc hệ thống gồm 8 thực thể (Entities) cốt lõi phục vụ song song hai mảng CMS nội dung và E-Commerce bán hàng:
  1. `Category.cs` - Quản lý phân loại danh mục tin tức, bài viết.
  2. `Post.cs` - Quản lý thông tin bài đăng, hình ảnh bài viết chi tiết.
  3. `User.cs` - Quản lý tài khoản quản trị hệ thống và phân quyền nhân sự.
  4. `CategoryProduct.cs` - Phân loại danh mục nhóm sản phẩm thương mại.
  5. `Product.cs` - Quản lý thông tin sản phẩm, giá cả, ảnh và số lượng tồn kho.
  6. `Customer.cs` - Quản lý thông tin khách hàng mua sắm và đăng nhập.
  7. `Order.cs` - Theo dõi đơn đặt hàng, ngày mua và trạng thái kiểm duyệt.
  8. `OrderDetail.cs` - Lưu trữ chi tiết các mặt hàng, giá bán trong từng hóa đơn.
* **Xây dựng phân lớp xử lý trung tâm (`CMS.Backend`):** Tạo dự án bằng công nghệ *ASP.NET Core Web App (Model-View-Controller)*. Thiết lập liên kết hệ thống (*Project Reference*) trực tiếp sang lớp `CMS.Data`.
* **Khởi tạo giao diện tĩnh người dùng (`cms.frontend`):** Tích hợp dự án ReactJS làm lớp hiển thị độc lập cho khách hàng.

### 🔹 BUỔI 2: XÂY DỰNG CƠ SỞ DỮ LIỆU THẬT VỚI EF CORE MIGRATION
* **Tích hợp các gói công cụ dữ liệu (NuGet Packages):** Cài đặt bộ ba thư viện Entity Framework Core (`SqlServer`, `Tools`, `Design`) tương thích vào hệ thống.
* **Xây dựng Trạm quản trị trung tâm (`ApplicationDbContext.cs`):** Khai báo tập hợp 8 bảng dữ liệu (`DbSet`) đại diện cho cấu trúc thực thể xuống SQL Server.
* **Cấu hình Chuỗi kết nối an toàn:** Cấu hình đường dẫn kết nối cục bộ bảo mật cao (`DefaultConnection`) trong tệp cấu hình hệ thống `appsettings.json`.
* **Kích hoạt Kỹ thuật Code First Migration:** * Chạy lệnh tạo bản vẽ kiến trúc phân tầng hệ thống: `Add-Migration InitialCreate` tại Package Manager Console.
  * Chạy lệnh đồng bộ trực tiếp: `Update-Database`, ép máy chủ cục bộ tự động sinh cơ sở dữ liệu thật mang tên `KhoaCmsDb` với đầy đủ liên kết khóa chính, khóa ngoại chặt chẽ.
* **Chuyển đổi dữ liệu thật:** Thay thế toàn bộ Mock Data (Dữ liệu giả) tại các tầng nghiệp vụ bằng các câu lệnh truy vấn LINQ thực tế lấy trực tiếp từ SQL Server.

---

## 🛠️ CÔNG NGHỆ ĐÃ TRIỂN KHAI
* **Backend Framework:** ASP.NET Core 8.0 MVC (Model - View - Controller)
* **Database ORM:** Entity Framework Core (DbContext / Code First)
* **Database Server:** Microsoft SQL Server & SSMS 
* **Frontend UI Admin:** Tailwind CSS v4.x (Utility-First), Bootstrap Icons v1.11

---

## 📦 HƯỚNG DẪN CÀI ĐẶT & CHẠY NGHIỆM THU (DÀNH CHO GIẢNG VIÊN)

Để Thầy có thể kích hoạt cấu trúc và nghiệm thu toàn bộ mã nguồn 2 buổi đầu tiên trên máy cá nhân, vui lòng thực hiện theo các bước sau:

### Bước 1: Cấu hình Chuỗi kết nối Database (Connection String)
Mở tệp `appsettings.json` trong dự án `CMS.Backend` và điều chỉnh lại tên Server Name của Thầy tại dòng mã nguồn sau:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TÊN_SERVER_SQL_CỦA_THẦY;Database=KhoaCmsDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
Bước 2: Thực thi Khởi tạo Cơ sở dữ liệu tự động (Migration)
Mở công cụ Package Manager Console trong Visual Studio lên, lưu ý chọn ô Default project trỏ về phân lớp dữ liệu CMS.Data, sau đó chạy lệnh sau để hệ thống tự động sinh cấu trúc bảng:

Shell
Update-Database
Bước 3: Khởi chạy dự án
Click chuột phải vào dự án CMS.Backend -> Chọn Set as Startup Project.

Nhấn phím F5 để khởi chạy website trên trình duyệt localhost.

Thầy nhập đường dẫn điều hướng truy cập: https://localhost:xxxx/Category để kiểm tra khả năng đổ dữ liệu thực tế từ các bảng SQL Server lên cấu trúc giao diện Tailwind CSS.

📁 CẤU TRÚC CÂY THƯ MỤC THỰC TẾ DỰ ÁN (ĐÃ ĐỒNG BỘ 100%)
Plaintext
├── KhoaCMS_Solution.sln                 --> File giải pháp quản lý tổng thể dự án
│
├── CMS.Data/                           --> LỚP DỮ LIỆU CỐT LÕI (CLASS LIBRARY)
│   ├── Entities/                       --> Định nghĩa mô hình thực thể Database
│   │   ├── Category.cs                 --> Thực thể quản lý Danh mục bài viết
│   │   ├── CategoryProduct.cs          --> Thực thể quản lý Danh mục sản phẩm
│   │   ├── Customer.cs                 --> Thực thể quản lý Thông tin khách hàng
│   │   ├── Order.cs                    --> Thực thể quản lý Đơn đặt hàng
│   │   ├── OrderDetail.cs              --> Thực thể quản lý Chi tiết hóa đơn
│   │   ├── Post.cs                     --> Thực thể quản lý Nội dung bài đăng
│   │   ├── Product.cs                  --> Thực thể quản lý Chi tiết sản phẩm
│   │   └── User.cs                     --> Thực thể quản lý Tài khoản hệ thống
│   ├── Migrations/                     --> Lưu trữ vết lịch sử khởi tạo cơ sở dữ liệu
│   └── ApplicationDbContext.cs         --> Trạm điều khiển, nạp cấu hình ánh xạ SQL
│
├── CMS.Backend/                        --> LỚP XỬ LÝ TRUNG TÂM VÀ ADMIN (ASP.NET CORE MVC)
│   ├── Controllers/                    --> Nhận yêu cầu và điều phối luồng dữ liệu
│   │   ├── CategoryController.cs       --> Điều hướng và xử lý CRUD Danh mục
│   │   ├── HomeController.cs           --> Điều hướng trang chủ Dashboard tổng quan
│   │   ├── PostController.cs           --> Điều hướng và xử lý CRUD Bài đăng viết bài
│   │   └── UserController.cs           --> Điều hướng phân quyền và bảo mật tài khoản
│   ├── Views/                          --> Khu vực kết xuất giao diện Tailwind CSS
│   │   ├── Category/                   --> Tập hợp View Danh mục (Index, Create, Edit)
│   │   ├── Home/                       --> Tập hợp View trang chủ điều khiển (Index, Privacy)
│   │   ├── Post/                       --> Tập hợp View Bài viết (Index, Create, Edit, Details)
│   │   ├── User/                       --> Tập hợp View Người dùng (Index, Create, Edit, Login)
│   │   └── Shared/                     --> Chứa khung bố cục Layout tổng (`_Layout.cshtml`)
│   ├── wwwroot/                        --> Nơi lưu trữ tài nguyên tĩnh (Ảnh upload từ máy, CSS)
│   ├── appsettings.json                --> Tệp cấu hình phân giải cổng và Chuỗi kết nối DB
│   └── Program.cs                      --> Điểm khởi chạy cấu hình dịch vụ Middleware hệ thống
│
└── cms.frontend/                       --> LỚP GIAO DIỆN CLIENTS NGOÀI (DỰ ÁN REACTJS TRỐN
