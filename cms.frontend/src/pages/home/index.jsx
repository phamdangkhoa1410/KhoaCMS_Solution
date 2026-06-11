/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/home/index.jsx
 * Chức năng: Component giao diện Trang Chủ Laptop High-End kết hợp Panel đồ án AI Premium
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../../components/layout/Banner';
import ProductCard from '../../components/ProductCard';
import axiosClient from '../../api/axiosClient';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/products');

                if (Array.isArray(response)) {
                    setProducts(response);
                } else if (response && Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi tải sản phẩm lên trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    return (
        <div className="container-fluid p-0" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* BƯỚC 1: ĐẬP BANNER SLIDER TỰ ĐỘNG LÊN ĐẦU TRANG CHỦ */}
            <Banner />

            {/* BƯỚC 2: PHÂN KHU NỘI DUNG CHÍNH CỦA TRANG CHỦ */}
            <div className="container my-5 px-3 px-md-4">

                {/* 1. LƯỚI KHU VỰC SẢN PHẨM MỚI NHẤT */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                        <h4 className="font-weight-bold text-dark text-uppercase mb-0" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                            <i className="bi bi-cpu-fill text-primary mr-2"></i> Siêu phẩm Laptop Mới Nhất ({products.length})
                        </h4>
                        <Link to="/products" className="text-primary font-weight-bold small text-decoration-none hover-link-effect" style={{ fontSize: '0.88rem' }}>
                            Xem tất cả dòng máy <i className="bi bi-chevron-right small ml-0.5"></i>
                        </Link>
                    </div>

                    {/* Hiệu ứng chờ nạp dữ liệu thật từ SQL Server */}
                    {loading ? (
                        <div className="text-center my-5 py-5 w-100 bg-white rounded shadow-sm border border-light">
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <div className="small font-weight-bold text-secondary">Đang đồng bộ cơ sở dữ liệu ASP.NET Core...</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-5 bg-white border border-light rounded shadow-sm px-4 w-100">
                            <i className="bi bi-gpu-card text-muted mb-2 d-block" style={{ fontSize: '2.5rem' }}></i>
                            <p className="text-secondary font-weight-bold mb-0">Hệ thống chưa tìm thấy dữ liệu máy hoặc API kết nối thất bại.</p>
                        </div>
                    ) : (
                        /* Lưới hiển thị các thẻ ProductCard siêu bốc */
                        <div className="row">
                            {products.map((product) => (
                                <div className="col-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch" key={product.id ?? product.Id}>
                                    <div className="w-100 card-hover-effect" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                                        <ProductCard product={product} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🚀 2. TẬN DỤNG TRIỆT ĐỂ CSS: KHỐI THÔNG TIN ĐỒ ÁN PHONG CÁCH AI CONTROL PANEL */}
                <div className="card border-0 shadow-lg position-relative overflow-hidden home-ai-panel" style={{ borderRadius: '16px', padding: '30px' }}>
                    <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>

                        <div className="col-lg-8 text-white">
                            <div className="d-flex align-items-center mb-3">
                                <span className="badge badge-warning text-uppercase font-weight-bold px-2.5 py-1.5 shadow" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                                    <i className="bi bi-shield-check mr-1"></i> Full-Stack Architecture
                                </span>
                            </div>

                            <h3 className="font-weight-bold mb-3 text-uppercase" style={{ fontSize: '1.45rem', letterSpacing: '0.5px', textShadow: '1px 1px 2px #000' }}>
                                KHOA LAPTOP MANAGEMENT SYSTEM
                            </h3>

                            <p className="text-light small mb-4" style={{ lineHeight: '1.6', fontSize: '0.88rem', opacity: 0.9, textShadow: '1px 1px 1px #000' }}>
                                Hệ thống quản trị và phân phối thiết bị công nghệ cao cấp. Kết nối toàn diện lớp phân tầng logic
                                <strong className="text-warning"> ASP.NET Core API / Entity Framework </strong> lưu trữ cơ sở dữ liệu SQL Server, xử lý bất đồng bộ dữ liệu real-time mượt mà trên môi trường
                                <strong className="text-info"> ReactJS Client-side (SPA) </strong>.
                            </p>

                            {/* Khối hiển thị thông tin sinh viên thiết kế 3D dập nổi */}
                            <div className="row no-gutters bg-dark-translucent p-3 rounded mb-3 border border-secondary shadow-inner">
                                <div className="col-sm-6 mb-2 mb-sm-0">
                                    <small className="text-muted-cyber d-block text-uppercase font-weight-bold" style={{ fontSize: '10px' }}>Sinh viên thực hiện:</small>
                                    <strong className="text-white" style={{ fontSize: '0.9rem' }}>Phạm Đăng Khoa</strong>
                                </div>
                                <div className="col-sm-3 mb-2 mb-sm-0">
                                    <small className="text-muted-cyber d-block text-uppercase font-weight-bold" style={{ fontSize: '10px' }}>Mã số SV:</small>
                                    <strong className="text-white" style={{ fontSize: '0.9rem' }}>2123110058</strong>
                                </div>
                                <div className="col-sm-3">
                                    <small className="text-muted-cyber d-block text-uppercase font-weight-bold" style={{ fontSize: '10px' }}>Lớp học phần:</small>
                                    <strong className="text-white" style={{ fontSize: '0.9rem' }}>CCQ2311B</strong>
                                </div>
                            </div>
                        </div>

                        {/* Phân khu bộ đôi nút bấm hành động */}
                        <div className="col-lg-4 text-lg-right mt-4 mt-lg-0">
                            <div className="d-flex flex-column justify-content-center h-100">
                                <Link className="btn btn-primary font-weight-bold py-2.5 px-4 mb-2 text-uppercase text-center shadow" to="/products" style={{ fontSize: '0.78rem', borderRadius: '8px' }}>
                                    <i className="bi bi-display mr-2"></i> Vào Kho Laptop
                                </Link>
                                <Link className="btn btn-outline-light font-weight-bold py-2.5 px-4 text-uppercase text-center" to="/blogs" style={{ fontSize: '0.78rem', borderRadius: '8px', textShadow: 'none' }}>
                                    <i className="bi bi-newspaper mr-2"></i> Tin tức công nghệ
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Dòng chữ bản quyền chân trang */}
                    <div className="border-top pt-3 mt-3 position-relative text-center text-md-left" style={{ fontSize: '11px', color: '#96a1b0', zIndex: 2, borderColor: '#ffffff20' }}>
                        <i className="bi bi-mortarboard mr-1.5 text-warning"></i> Đồ án tốt nghiệp khóa 2023-2026 | Trường Cao Đẳng Công Thương TP.HCM (HITC)
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;