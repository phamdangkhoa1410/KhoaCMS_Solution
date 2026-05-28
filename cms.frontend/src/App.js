/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Buổi 7: Gắn linh kiện CategoryProductList vào giao diện chính App.js
 */

import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import './App.css'; // File chứa các style tùy biến riêng của dự án

function App() {
    return (
        <div className="container mt-5">
            {/* Phần Header của Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="font-weight-bold text-dark text-uppercase" style={{ fontSize: '1.5rem', display: 'block' }}>
                    🛒 HỆ THỐNG CỬA HÀNG TRỰC TUYẾN - KHOACMS RETAIL
                </span>
            </header>

            <div className="row">
                {/* Cột bên trái (Sidebar): Chiếm 3 phần chiều rộng để hiện hộp danh mục sản phẩm */}
                <div className="col-md-3 mb-4">
                    <CategoryProductList />
                </div>

                {/* Cột bên phải (Content): Chiếm 9 phần chiều rộng để hiện nội dung chào mừng */}
                <div className="col-md-9">
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
        </div>
    );
}

export default App;