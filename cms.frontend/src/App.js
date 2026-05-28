/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * BUỔI 8: HOÀN THÀNH XỬ LÝ VÒNG ĐỜI USEEFFECT & TÍCH HỢP FULL NÂNG CAO PHÂN HỆ TIN TỨC
 */

import React from 'react';
import CategoryProductList from './components/CategoryProductList'; // Danh mục sản phẩm (Từ Buổi 7)
import PostList from './components/PostList';                     // Danh sách bài viết tin tức (Thực hành chung Buổi 8)
import BlogCategoryList from './components/BlogCategoryList';     // BÀI TẬP TỰ LÀM: Chuyên mục tin tức Blog (Bài tập tự làm Buổi 8)
import './App.css';

function App() {
    return (
        <div className="container mt-5">
            {/* ========================================================== */}
            {/* PHẦN HEADER TỔNG CỦA WEBSITE ĐỒ ÁN                         */}
            {/* ========================================================== */}
            <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
                <span className="font-weight-bold text-dark text-uppercase" style={{ fontSize: '1.4rem' }}>
                    👗 Fashion Boutique - Hệ Thống Quản Trị Nội Dung & Bán Hàng
                </span>
                <span className="badge badge-success px-3 py-2 font-weight-bold" style={{ fontSize: '0.85rem' }}>
                    Học Phần Chuyên Đề ASP.NET + ReactJS
                </span>
            </header>

            {/* ========================================================== */}
            {/* PHẦN THÂN TRANG CHỦ - CẤU TRÚC PHÂN LUỒNG SONG SONG        */}
            {/* ========================================================== */}
            <div className="row">

                {/* -------------------------------------------------------- */}
                {/* CỘT TRÁI (BỀ RỘNG 4): SIDEBAR CHỨA BỘ ĐÔI BỘ LỌC DỮ LIỆU */}
                {/* -------------------------------------------------------- */}
                <div className="col-md-4">
                    {/* Phân loại 1: Bộ lọc phục vụ thương mại điện tử mua sắm sản phẩm (CategoryProduct) */}
                    <CategoryProductList />

                    {/* Phân loại 2 [BÀI TẬP TỰ LÀM BUỔI 8]: Chuyên mục nội dung tin tức blog (Category) */}
                    <BlogCategoryList />
                </div>

                {/* -------------------------------------------------------- */}
                {/* CỘT PHẢI (BỀ RỘNG 8): KHU VỰC HIỂN THỊ TIN TỨC CHÍNH     */}
                {/* -------------------------------------------------------- */}
                <div className="col-md-8">
                    {/* Nội dung tin tức lấy Real-time từ Database bằng Hook useEffect */}
                    <PostList />
                </div>

            </div>

            {/* ========================================================== */}
            {/* PHẦN FOOTER ĐỒ ÁN - MINH CHỨNG THÔNG TIN SINH VIÊN        */}
            {/* ========================================================== */}
            <footer className="pt-3 mt-5 text-muted border-top text-center small">
                <p>© 2026 - Đồ án thực hành phân tầng ASP.NET Core Web API kết hợp ReactJS Client-side</p>
                <p className="font-weight-bold text-secondary" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
                    Sinh viên: Phạm Đăng Khoa | MSV: 2123110058 | Lớp: CCQ2311B - Trường Cao đẳng Công Thương TP.HCM
                </p>
            </footer>
        </div>
    );
}

export default App;