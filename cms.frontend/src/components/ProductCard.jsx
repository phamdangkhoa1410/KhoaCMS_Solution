/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/ProductCard.jsx
 * Chức năng: Component hiển thị thẻ Laptop - Tích hợp đầy đủ bộ 3 nút: Cấu hình, Giỏ hàng và MUA NGAY bốc lửa
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    if (!product) {
        return <div className="p-3 text-center text-muted small border rounded">Đang tải sản phẩm...</div>;
    }

    // 🔔 BẪY TRƯỜNG: Đọc linh hoạt cả chữ hoa và chữ thường từ API SQL Server của Khoa
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name ?? "Chưa cập nhật tên máy";
    const price = product.price ?? product.Price ?? 0;
    const imageUrl = product.imageUrl ?? product.ImageUrl;
    const description = product.description ?? product.Description ?? 'Không có thông tin mô tả chi tiết từ hệ thống...';
    const stockQuantity = product.stockQuantity ?? product.StockQuantity ?? 0;
    const categoryName = product.categoryProductName ?? product.CategoryProductName ?? "Laptop Gaming";

    return (
        <div
            className="card h-100 border-0 shadow-sm rounded-lg overflow-hidden position-relative bg-white"
            style={{
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
        >
            {/* 1. KHU VỰC HIỂN THỊ HÌNH ẢNH (Giữ nguyên vẹn tỷ lệ máy) */}
            <Link
                to={`/product/${id}`}
                className="d-flex align-items-center justify-content-center position-relative overflow-hidden"
                style={{
                    height: '180px',
                    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                    padding: '12px'
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl.startsWith('http') ? imageUrl : `https://localhost:7243${imageUrl}`}
                        alt={name}
                        className="w-100 h-100"
                        style={{
                            objectFit: 'contain',
                            transition: 'transform 0.4s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div className="text-center text-muted">
                        <i className="bi bi-laptop" style={{ fontSize: '2.5rem', opacity: 0.4 }}></i>
                    </div>
                )}

                <span
                    className="badge badge-primary position-absolute font-weight-bold shadow-sm"
                    style={{ top: '12px', left: '12px', borderRadius: '6px', padding: '5px 10px', fontSize: '0.65rem', background: '#007bff' }}
                >
                    <i className="fa-solid fa-bolt mr-1 text-warning"></i> High Perf
                </span>
            </Link>

            {/* 2. KHU VỰC NỘI DUNG CHỮ & THÔNG SỐ */}
            <div className="card-body p-3 d-flex flex-column justify-content-between" style={{ backgroundColor: '#ffffff' }}>
                <div>
                    <div className="mb-1">
                        <span className="badge text-primary font-weight-bold bg-light border border-light" style={{ fontSize: '0.7rem', padding: '3px 6px', borderRadius: '4px' }}>
                            {categoryName}
                        </span>
                    </div>

                    <Link to={`/product/${id}`} className="text-decoration-none">
                        <h6
                            className="font-weight-bold text-dark mb-1"
                            title={name}
                            style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.4',
                                height: '38px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {name}
                        </h6>
                    </Link>

                    <p className="text-muted mb-2" style={{ fontSize: '0.75rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {description}
                    </p>
                </div>

                <div>
                    {/* Khối giá tiền và số lượng kho */}
                    <div className="d-flex justify-content-between align-items-center mb-2.5 pt-2 border-top border-light">
                        <span className="font-weight-bold text-danger" style={{ fontSize: '1rem' }}>
                            {price.toLocaleString('vi-VN')} đ
                        </span>

                        {stockQuantity > 0 ? (
                            <span className="badge badge-light border text-success font-weight-bold px-2 py-0.5" style={{ fontSize: '0.68rem', borderRadius: '4px' }}>
                                Kho: {stockQuantity}
                            </span>
                        ) : (
                            <span className="badge badge-soft-danger text-danger font-weight-bold px-2 py-0.5" style={{ fontSize: '0.68rem', borderRadius: '4px', backgroundColor: '#fff5f5' }}>
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* 🎯 BẢO TÀNG NÚT BẤM 3 TẦNG ĐỈNH CAO */}
                    <div className="w-100">
                        {/* HÀNG 1: Gom "Cấu hình" và "Giỏ hàng" nằm chung một hàng */}
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Link
                                to={`/product/${id}`}
                                className="btn btn-outline-primary btn-sm font-weight-bold py-1.5 flex-grow-1 mr-2 d-flex align-items-center justify-content-center"
                                style={{ fontSize: '0.72rem', borderRadius: '6px' }}
                            >
                                <i className="bi bi-cpu mr-1"></i> Cấu hình
                            </Link>

                            <button
                                type="button"
                                className="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center border"
                                style={{ borderRadius: '6px', width: '32px', height: '32px', backgroundColor: '#f8f9fa' }}
                                title="Thêm vào giỏ hàng"
                            >
                                <i className="bi bi-cart-plus-fill text-dark" style={{ fontSize: '0.9rem' }}></i>
                            </button>
                        </div>

                        {/* HÀNG 2: 🚀 NÚT MUA NGAY ĐỘC QUYỀN BẢN RỘNG BỐC LỬA */}
                        <Link
                            to={stockQuantity > 0 ? `/cart?instantProductId=${id}` : '#'}
                            className={`btn btn-sm btn-block font-weight-bold text-uppercase py-2 d-flex align-items-center justify-content-center border-0 text-white shadow-sm ${stockQuantity > 0 ? '' : 'disabled'}`}
                            style={{
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                                letterSpacing: '0.5px',
                                background: stockQuantity > 0 ? 'linear-gradient(135deg, #ff5e36 0%, #ff4e20 100%)' : '#6c757d',
                                cursor: stockQuantity > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <i className="bi bi-lightning-fill mr-1 text-warning"></i> Mua ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;