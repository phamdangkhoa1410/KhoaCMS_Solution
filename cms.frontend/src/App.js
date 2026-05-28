/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Phần thực hành mở rộng Buổi 7: Tích hợp phân hệ Tin tức & Blog thời trang (Hoàn chỉnh)
 */

import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import PostList from './components/PostList'; // Import linh kiện tin tức mới tạo ở Bước 2
import './App.css';

function App() {
    return (
        <div className="container mt-5">
            {/* ========================================================== */}
            {/* PHẦN HEADER TỔNG CỦA WEBSITE                               */}
            {/* ========================================================== */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="font-weight-bold text-dark text-uppercase" style={{ fontSize: '1.5rem', display: 'block' }}>
                    👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                </span>
            </header>

            {/* ========================================================== */}
            {/* KHU VỰC 1: SHOPPING (Sidebar danh mục và nội dung chào mừng) */}
            {/* ========================================================== */}
            <div className="row">
                {/* Cột bên trái (Sidebar): Hiện hộp danh mục sản phẩm của Khoa */}
                <div className="col-md-3 mb-4">
                    <CategoryProductList />
                </div>

                {/* Cột bên phải (Content): Hiện khung Jumbotron thông tin */}
                <div className="col-md-9 mb-4">
                    <div className="jumbotron bg-light border p-5 rounded shadow-sm">
                        <h2 className="display-5 font-weight-normal" style={{ fontSize: '2rem' }}>Chào mừng đến với không gian trải nghiệm!</h2>
                        <p className="lead mt-3 text-secondary" style={{ fontSize: '1.1rem' }}>
                            Khối dữ liệu bên thanh điều hướng trái đang được tải <strong>Real-time</strong> trực tiếp từ bảng
                            <strong> CategoryProduct</strong> trong Database SQL Server thông qua nền tảng ASP.NET Core Web API.
                        </p>
                        <hr className="my-4" />
                        <p className="text-muted">Hãy đảm bảo rằng bạn đã bật chạy Backend song song để dữ liệu không bị chặn hiển thị.</p>
                    </div>
                </div>
            </div>

            {/* ========================================================== */}
            {/* KHU VỰC 2: BLOG & TIN TỨC MỚI (Dàn ngang toàn bộ ở phía dưới) */}
            {/* ========================================================== */}
            <div className="row mt-4">
                <div className="col-12">
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;