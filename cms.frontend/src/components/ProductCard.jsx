/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/ProductCard.jsx
 * Chức năng: Component hiển thị thẻ Laptop - Tích hợp đầy đủ bộ 3 nút: Cấu hình, Giỏ hàng và MUA NGAY bốc lửa
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

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

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
                window.location.href = '/login';
                return;
            }

            const user = JSON.parse(userStr);
            const productId = product.Id || product.id;
            const customerId = user.id || user.Id;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/Cart/Add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ CustomerId: customerId, ProductId: productId, Quantity: 1 })
            });

            if (response.ok) {
                window.dispatchEvent(new Event('cartUpdate'));
                alert("🎉 Đã thêm thành công sản phẩm vào giỏ hàng!");
            } else {
                alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };

    const handleBuyNow = async (e) => {
        e.preventDefault();
        if (stockQuantity <= 0) return;
        
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Vui lòng đăng nhập để mua hàng!');
            window.location.href = '/login';
            return;
        }

        navigate('/checkout', {
            state: {
                selectedItems: [
                    {
                        id: product.id || product.Id,
                        name: product.name || product.Name,
                        price: product.price || product.Price,
                        imageUrl: product.imageUrl || product.ImageUrl,
                        quantity: 1
                    }
                ],
                isBuyNow: true
            }
        });
    };

    return (
        <div
            className="card h-100 border-0 bg-white"
            style={{
                borderRadius: '20px',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }}
        >
            {/* 1. KHU VỰC HIỂN THỊ HÌNH ẢNH */}
            <Link
                to={`/product/${id}`}
                className="d-flex align-items-center justify-content-center position-relative overflow-hidden"
                style={{
                    height: '200px',
                    background: 'linear-gradient(to bottom, #ffffff, #f8faff)',
                    padding: '20px'
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl.startsWith('http') ? imageUrl : `https://localhost:7243${imageUrl}`}
                        alt={name}
                        className="w-100 h-100"
                        style={{
                            objectFit: 'contain',
                            transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div className="text-center text-muted">
                        <i className="bi bi-laptop" style={{ fontSize: '3.5rem', opacity: 0.2 }}></i>
                    </div>
                )}

                <span
                    className="position-absolute font-weight-bold shadow-sm d-flex align-items-center"
                    style={{ 
                        top: '15px', 
                        left: '15px', 
                        borderRadius: '20px', 
                        padding: '4px 10px', 
                        fontSize: '0.65rem', 
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        letterSpacing: '0.5px'
                    }}
                >
                    <i className="fa-solid fa-bolt mr-1 text-warning"></i> High Perf
                </span>
            </Link>

            {/* 2. KHU VỰC NỘI DUNG CHỮ & THÔNG SỐ */}
            <div className="card-body p-4 d-flex flex-column justify-content-between" style={{ backgroundColor: '#ffffff', zIndex: 2 }}>
                <div>
                    <div className="mb-2">
                        <span className="font-weight-bold" style={{ 
                            fontSize: '0.7rem', 
                            padding: '4px 10px', 
                            borderRadius: '6px',
                            backgroundColor: '#e0e7ff',
                            color: '#4f46e5',
                            letterSpacing: '0.5px'
                        }}>
                            {categoryName}
                        </span>
                    </div>

                    <Link to={`/product/${id}`} className="text-decoration-none">
                        <h6
                            className="font-weight-bold mb-2"
                            title={name}
                            style={{
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                height: '44px',
                                color: '#1e293b',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                            onMouseLeave={e => e.currentTarget.style.color = '#1e293b'}
                        >
                            {name}
                        </h6>
                    </Link>
                </div>

                <div>
                    {/* Khối giá tiền và số lượng kho */}
                    <div className="d-flex justify-content-between align-items-end mb-3 pt-3" style={{ borderTop: '1px dashed #e2e8f0' }}>
                        <div>
                            <small className="d-block text-muted mb-1" style={{ fontSize: '0.7rem', fontWeight: 600 }}>GIÁ CHÍNH HÃNG</small>
                            <span className="font-weight-bold" style={{ fontSize: '1.15rem', color: '#ef4444', letterSpacing: '-0.5px' }}>
                                {price.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        {stockQuantity > 0 ? (
                            <span className="badge font-weight-bold px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#166534' }}>
                                Kho: {stockQuantity}
                            </span>
                        ) : (
                            <span className="badge font-weight-bold px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* 🎯 BẢO TÀNG NÚT BẤM 3 TẦNG ĐỈNH CAO */}
                    <div className="w-100 mt-2">
                        {/* HÀNG 1: Gom "Cấu hình" và "Giỏ hàng" nằm chung một hàng */}
                        <div className="d-flex align-items-center justify-content-between mb-2" style={{ gap: '8px' }}>
                            <Link
                                to={`/product/${id}`}
                                className="btn font-weight-bold py-1 flex-grow-1 mr-1 d-flex align-items-center justify-content-center"
                                style={{ 
                                    fontSize: '0.75rem', 
                                    borderRadius: '8px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                            >
                                <i className="bi bi-cpu mr-2"></i> Cấu hình
                            </Link>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="btn p-0 d-flex align-items-center justify-content-center shadow-sm"
                                style={{ 
                                    borderRadius: '8px', 
                                    width: '36px', 
                                    height: '34px', 
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.2s',
                                    color: '#3b82f6'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                title="Thêm vào giỏ hàng"
                            >
                                <i className="bi bi-cart-plus-fill" style={{ fontSize: '1rem' }}></i>
                            </button>
                        </div>

                        {/* HÀNG 2: 🚀 NÚT MUA NGAY ĐỘC QUYỀN BẢN RỘNG BỐC LỬA */}
                        <button
                            type="button"
                            onClick={handleBuyNow}
                            disabled={stockQuantity <= 0}
                            className={`btn btn-block font-weight-bold text-uppercase py-2 d-flex align-items-center justify-content-center border-0 text-white shadow-sm ${stockQuantity > 0 ? '' : 'disabled'}`}
                            style={{
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                letterSpacing: '0.5px',
                                background: stockQuantity > 0 ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : '#94a3b8',
                                cursor: stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s',
                                boxShadow: stockQuantity > 0 ? '0 4px 12px rgba(234, 88, 12, 0.3)' : 'none'
                            }}
                            onMouseEnter={e => { if (stockQuantity > 0) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { if (stockQuantity > 0) e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <i className="bi bi-lightning-fill mr-2 text-warning" style={{ fontSize: '1rem' }}></i> Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;