/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 12.3 - Đồng bộ cấu trúc Auto-index cho cả trang Chi tiết sản phẩm và Chi tiết bài viết
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Nhập các thành phần giao diện bố cục toàn cục (Header, Footer)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// 2. Nhập các trang tính năng chính theo cơ chế định tuyến phẳng ngắn gọn
import Home from './pages/home';
import Shop from './pages/shop';
import Blog from './pages/blog';
import ProductDetail from './pages/product-detail';

// 🔔 ĐÃ THÊM: Dự phòng sẵn import trang Chi tiết bài viết (Dành cho tính năng đọc nội dung tin tức)
// Khoa chỉ cần tạo folder 'blog-detail' và file 'index.jsx' bên trong là tự động khớp nối
import BlogDetail from './pages/blog-detail';

import './App.css';

function App() {
    return (
        <Router>
            {/* Khung cấu trúc Flexbox giúp giữ chân cố định Footer luôn nằm ở đáy màn hình */}
            <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>

                {/* Thanh điều hướng Header dùng chung cho toàn bộ website */}
                <Header />

                {/* Phần ruột hiển thị nội dung thay đổi linh hoạt dựa theo URL trên thanh địa chỉ */}
                <main className="py-4 flex-grow-1">
                    <div className="container mt-2">
                        <Routes>
                            {/* Tuyến đường mặc định - Trang Chủ (/) */}
                            <Route path="/" element={<Home />} />

                            {/* Tuyến đường phân hệ Cửa Hàng - Danh sách sản phẩm (/products) */}
                            <Route path="/products" element={<Shop />} />

                            {/* Tuyến đường xem chi tiết một sản phẩm cụ thể dựa trên ID động (:id) */}
                            <Route path="/product/:id" element={<ProductDetail />} />

                            {/* Tuyến đường phân hệ Tin Tức - Danh sách bài viết bài đăng (/blogs) */}
                            <Route path="/blogs" element={<Blog />} />

                            {/* 🔔 ĐÃ THÊM: Tuyến đường xem chi tiết nội dung 1 bài viết dựa trên ID động (:id) */}
                            {/* Ví dụ: Khi URL là /blog/3, React Router sẽ gọi component BlogDetail để hiển thị nội dung */}
                            <Route path="/blog/:id" element={<BlogDetail />} />
                        </Routes>
                    </div>
                </main>

                {/* Thanh thông tin chân trang Footer dùng chung */}
                <Footer />

            </div>
        </Router>
    );
}

export default App;