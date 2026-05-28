# 🖥️ HỆ THỐNG QUẢN TRỊ NỘI DUNG VÀ THƯƠNG MẠI ĐIỆN TỬ (KHOA-CMS)

> **Đồ án môn học:** Phát triển ứng dụng Web / Công nghệ phần mềm
> **Trường Cao Đẳng Công Thương TP.HCM (HITC)**
> **Báo cáo tiến độ hoàn thiện:** Từ Buổi 1 đến Buổi 6 (Tích hợp Kiến trúc lai Hybrid Web API)

---

## 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Phạm Đăng Khoa
* **Mã số sinh viên (MSSV):** 2123110058
* **Lớp:** CCQ2311B
* **Năm thực hiện:** 2026

---

## 🚀 TIẾN ĐỘ CHI TIẾT ĐÃ HOÀN THÀNH (TỪ BUỔI 1 ĐẾN BUỔI 6)

### 🔹 BUỔI 1 & BUỔI 2: KHỞI TẠO CẤU TRÚC GIẢI PHÁP ĐA LỚP & ĐỒNG BỘ SQL SERVER
* **Thiết lập Solution tổng thể:** Tạo giải pháp `KhoaCMS_Solution` bóc tách độc lập 3 phân lớp dự án: `CMS.Data` (Class Library), `CMS.Backend` (ASP.NET Core MVC), và `cms.frontend` (ReactJS).
* **Định nghĩa 8 thực thể cốt lõi:** Cấu hình thực thể song hành hệ thống CMS nội dung (`Category`, `Post`, `User`) và E-Commerce bán hàng (`CategoryProduct`, `Product`, `Customer`, `Order`, `OrderDetail`).
* **Đồng bộ Cơ sở dữ liệu:** Tích hợp Entity Framework Core, thực thi kỹ thuật *Code First Migration* (`Add-Migration` & `Update-Database`) tạo lập thành công Database `KhoaCmsDb` cục bộ với đầy đủ ràng buộc khóa ngoại chặt chẽ.

### 🔹 BUỔI 3 & BUỔI 4: PHÁT TRIỂN CHỨC NĂNG QUẢN TRỊ NỀN TẢNG (CRUD)
* **Xây dựng bộ điều khiển Admin:** Hoàn thiện mã nguồn xử lý logic dữ liệu cho `CategoryController`, `PostController`, và `UserController`.
* **Thiết kế giao diện quản trị:** Kết xuất dữ liệu từ SQL Server lên hệ thống View giao diện sử dụng nền tảng Tailwind CSS v4.x và bộ thư viện Bootstrap Icons cho các tính năng xem danh sách, thêm mới, hiệu chỉnh và xóa bản ghi.

### 🔹 BUỔI 5: CÀI ĐẶT BẢO MẬT COOKIE AUTHENTICATION & PHAN QUYỀN
* **Cấu hình dịch vụ xác thực:** Cài đặt dịch vụ bảo mật Cookie Authentication trong `Program.cs`. Thiết lập chặt chẽ luồng `LoginPath` và `AccessDeniedPath`.
* **Cài đặt ổ khóa Controller:** Đóng băng hệ thống bằng bộ lọc `[Authorize]`. Thực hiện phân quyền chi tiết (Role-based) đồng bộ trực tiếp với Database: tài khoản quyền `Editor` được Thêm/Sửa tin tức nhưng bị cấm Xóa và cấm truy cập hệ thống `User`; quyền `Quản trị viên` giữ toàn quyền tối cao.
* **Tối ưu hóa UI:** Xây dựng View thông báo lỗi truy cập hệ thống chuẩn `403 Access Denied`.

### 🔹 BUỔI 6: KIẾN TRÚC LAI HYBRID WEB API & RESTFUL SERVICES
* **Tích hợp thư viện Swagger:** Cài đặt thành công thư viện trung gian `Swashbuckle.AspNetCore`. Cấu hình Middleware mở trang tra cứu API với giao diện mang tên chính chủ `KhoaCMS Web API v1`.
* **Phát triển Endpoint RESTful:** Thiết lập phân luồng song hành `app.MapControllers()` giúp hệ thống vừa chạy trang Razor MVC cũ, vừa mở cổng lấy dữ liệu thô (JSON).
  * **Hệ thống API Posts:** `GET /api/posts` (Lấy danh sách gọt tỉa tối ưu băng thông), `GET /api/posts/category/{id}` (Lọc theo chuyên mục tin), và `GET /api/posts/{id}` (Xem chi tiết 100% nội dung HTML).
  * **Hệ thống API Phân loại Sản phẩm:** `GET /api/CategoriesProducts` (Lấy bộ lọc phân loại quần áo công sở/dạ hội sắp xếp theo `DisplayOrder`).
  * **Hệ thống API Sản phẩm:** `GET /api/products` (Lấy danh sách quần áo) và `GET /api/products/{id}` (Xem chi tiết chất liệu vải).
  * **Hệ thống API Đơn đặt hàng:** `POST /api/Orders` (Tiếp nhận bưu phẩm dữ liệu thông tin mua hàng từ giỏ hàng Frontend đẩy lên thông qua lớp trung gian `OrderInputDTO` để lưu xuống cơ sở dữ liệu với mã trạng thái `201 Created`).
* **Thông cửa bảo mật CORS:** Khai báo cấu hình chính sách `AllowAll` cho phép ứng dụng `cms.frontend` (ReactJS) ở các cổng Port khác có quyền kết nối rút dữ liệu hợp pháp.
* **Kiểm định chất lượng:** Đối soát thành công cấu trúc chuỗi JSON đầu ra hoạt động thông suốt trên cả giao diện Swagger UI và phần mềm kiểm thử chuyên nghiệp Postman.

---

## 🛠️ CÔNG NGHỆ ĐÃ TRIỂN KHAI
* **Backend Framework:** ASP.NET Core 8.0 (Kiến trúc lai Hybrid Web MVC + Web API RESTful)
* **Database ORM:** Entity Framework Core (DbContext / Code First Migration)
* **Database Server:** Microsoft SQL Server & SSMS 
* **API Testing Tools:** Swagger UI & Postman Client
* **Security Middleware:** Cookie Authentication & CORS Policy (AllowAll)
* **Frontend UI Admin:** Tailwind CSS v4.x (Utility-First), Bootstrap v5 (Error Page)

---

## 📦 HƯỚNG DẪN CÀI ĐẶT & CHẠY NGHIỆM THU (DÀNH CHO GIẢNG VIÊN)

### Bước 1: Cấu hình Chuỗi kết nối Database (Connection String)
Mở tệp `appsettings.json` trong dự án `CMS.Backend` và điều chỉnh lại tên Server Name của Thầy tại dòng mã nguồn sau:
```json
Bước 2: Thực thi Khởi tạo Cơ sở dữ liệu tự động (Migration)Mở công cụ Package Manager Console trong Visual Studio lên, lưu ý chọn ô Default project trỏ về phân lớp dữ liệu CMS.Data, sau đó thực thi câu lệnh:ShellUpdate-Database
Bước 3: Khởi chạy và Nghiệm thu Hệ thống Lai (Hybrid)Click chuột phải vào dự án CMS.Backend $\rightarrow$ Chọn Set as Startup Project.Nhấn phím F5 để khởi chạy website.Thầy có thể tiến hành nghiệm thu đồng thời qua 3 luồng kiểm định độc lập sau:Kênh Giao diện Quản trị cũ (MVC): Truy cập https://localhost:xxxx/ để kiểm tra giao diện đồ họa cũ và hệ thống bảo mật khóa Cookie phân quyền làm từ Buổi 5.Kênh Tra cứu Tài liệu API (Swagger): Truy cập https://localhost:xxxx/swagger để kiểm tra cửa ngõ giao tiếp API chính chủ mang tên KhoaCMS Web API v1. Tại đây Thầy có thể bấm Try it out và Execute để kiểm tra dữ liệu thật đổ ra.Kênh Dữ liệu JSON thô (Postman): Sử dụng phần mềm Postman gọi lệnh GET https://localhost:xxxx/api/products để xem cấu trúc mảng JSON đã được gọt tỉa, hoặc gọi lệnh POST https://localhost:xxxx/api/Orders kèm Body dạng JSON để giả lập giỏ hàng đặt hàng xuống SQL Server.📁 CẤU TRÚC CÂY THƯ MỤC THỰC TẾ DỰ ÁN (CẬP NHẬT ĐẾN BUỔI 6)Plaintext├── KhoaCMS_Solution.sln         --> File giải pháp quản lý tổng thể dự án
│
├── CMS.Data/                    --> LỚP DỮ LIỆU CỐT LÕI (CLASS LIBRARY)
│   ├── Entities/                --> Định nghĩa mô hình thực thể Database (8 thực thể)
│   ├── Migrations/              --> Lưu trữ vết lịch sử khởi tạo cơ sở dữ liệu
│   └── ApplicationDbContext.cs  --> Trạm điều khiển, nạp cấu hình ánh xạ SQL
│
├── CMS.Backend/                 --> LỚP XỬ LÝ TRUNG TÂM VÀ ADMIN (ASP.NET CORE MVC)
│   ├── Controllers/             --> Nhận yêu cầu và điều phối luồng dữ liệu (Hybrid)
│   │   ├── CategoryController.cs--> [MVC] Điều hướng và xử lý CRUD Danh mục bài viết
│   │   ├── PostController.cs    --> [MVC] Xử lý CRUD Bài đăng (Có ổ khóa phân quyền Buổi 5)
│   │   ├── UserController.cs    --> [MVC] Quản trị tài khoản hệ thống (Chỉ dành cho Quản trị viên)
│   │   ├── AccountController.cs --> [MVC] Xử lý logic Đăng nhập/Đăng xuất/Cấp phát Cookie
│   │   ├── PostsController.cs   --> [API] Trả về dữ liệu JSON của Bài viết (GetAll, GetByCategory, GetDetail)
│   │   ├── ProductsController.cs--> [API] Trả về dữ liệu JSON của Sản phẩm thời trang
│   │   ├── CategoriesProductsController.cs --> [API] Trả về dữ liệu JSON của Danh mục sản phẩm
│   │   └── OrdersController.cs  --> [API] Tiếp nhận gói tin POST dữ liệu đặt hàng lưu xuống SQL
│   ├── Views/                   --> Khu vực kết xuất giao diện đồ họa (.cshtml)
│   ├── wwwroot/                 --> Nơi lưu trữ tài nguyên tĩnh (Ảnh sản phẩm, CSS)
│   ├── appsettings.json         --> Tệp cấu hình cổng mạng và Chuỗi kết nối DB
│   └── Program.cs               --> Cấu hình dịch vụ hệ thống (Cookie Auth, Swagger UI, CORS AllowAll)
│
└── cms.frontend/                --> LỚP GIAO DIỆN CLIENTS NGOÀI (DỰ ÁN REACTJS)
"ConnectionStrings": {
  "DefaultConnection": "Server=TEN_SERVER_SQL_CỦA_THẦY;Database=KhoaCmsDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
