/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Chức năng: Component hiển thị Chi tiết sản phẩm theo ID từ API SQL Server
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService'; // Lội ngược 2 tầng ra lấy service

const ProductDetail = () => {
    // 1. Lấy biến id động từ URL (Ví dụ: /product/5 -> id = 5)
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // 2. useEffect tự động kích hoạt gọi API ngay khi nạp trang
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductById(id);

                // Bóc tách object sản phẩm an toàn từ API dội về
                if (response && response.data) {
                    setProduct(response.data);
                } else {
                    setProduct(response);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]); // Chạy lại nếu id trên URL thay đổi

    if (loading) {
        return <div className="text-center my-5 font-weight-bold text-secondary">Đang nạp chi tiết sản phẩm...</div>;
    }

    if (!product) {
        return (
            <div className="alert alert-warning text-center my-4 font-weight-bold">
                ⚠️ Không tìm thấy thông tin sản phẩm này trong Database hệ thống!
            </div>
        );
    }

    const handleAddToCart = async () => {
        try {
            const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
            const finalQty = parseInt(quantity) || 1;
            
            if (finalQty < 1) {
                alert('Số lượng phải lớn hơn 0!');
                setQuantity(1);
                return;
            }
            if (finalQty > stock) {
                alert(`Số lượng sản phẩm trong kho không đủ! (Chỉ còn ${stock})`);
                setQuantity(stock);
                return;
            }

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
                body: JSON.stringify({ CustomerId: customerId, ProductId: productId, Quantity: finalQty })
            });

            if (response.ok) {
                window.dispatchEvent(new Event('cartUpdate'));
                alert("🛒 Đã thêm thành công sản phẩm vào giỏ hàng!");
            } else {
                const errorData = await response.json().catch(() => null);
                alert(errorData?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!');
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };

    return (
        <div className="container py-4 my-4" style={{ backgroundColor: '#f8fafc', borderRadius: '24px', minHeight: '80vh' }}>
            {/* Nút quay lại trang cửa hàng nhanh */}
            <div className="mb-4 px-2">
                <Link to="/products" className="btn btn-white font-weight-bold shadow-sm" style={{ borderRadius: '12px', padding: '10px 20px', color: '#64748b', transition: 'all 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    <i className="bi bi-arrow-left mr-2"></i> Quay lại cửa hàng
                </Link>
            </div>

            {/* Khung chi tiết mặt hàng được làm mới siêu Premium */}
            <div className="card shadow border-0 overflow-hidden bg-white" style={{ borderRadius: '24px' }}>
                <div className="row no-gutters align-items-stretch">

                    {/* KHỐI TRÁI: Hình ảnh sản phẩm lớn */}
                    <div className="col-lg-5 p-4 p-md-5 d-flex align-items-center justify-content-center position-relative" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)' }}>
                        <div className="position-absolute" style={{ top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)' }}></div>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://localhost:7243${product.imageUrl}`}
                                alt={product.name}
                                className="img-fluid object-cover position-relative z-index-1"
                                style={{ maxHeight: '400px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))', transition: 'transform 0.5s ease' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/400x400?text=Premium+Laptop';
                                }}
                            />
                        ) : (
                            <i className="bi bi-laptop text-muted position-relative z-index-1" style={{ fontSize: '6rem', opacity: 0.2 }}></i>
                        )}
                    </div>

                    {/* KHỐI PHẢI: Thông tin chữ, giá tiền và nút hành động */}
                    <div className="col-lg-7 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-2">
                            <span className="badge px-3 py-2 text-uppercase font-weight-bold shadow-sm" style={{ letterSpacing: '1.5px', borderRadius: '8px', background: 'linear-gradient(90deg, #3b82f6, #2dd4bf)', color: 'white', fontSize: '0.75rem' }}>
                                <i className="bi bi-shield-check mr-1"></i> Mặt hàng chính hãng
                            </span>
                        </div>

                        <h1 className="font-weight-bold text-dark mb-3 mt-2" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                            {product.name || product.Name}
                        </h1>

                        {/* Khu vực hiển thị giá tiền nổi bật */}
                        <div className="p-4 my-4" style={{ borderRadius: '16px', background: 'linear-gradient(to right, #f8fafc, #ffffff)', border: '1px solid #e2e8f0', borderLeft: '4px solid #ef4444' }}>
                            <span className="text-uppercase font-weight-bold d-block mb-1" style={{ color: '#94a3b8', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                Giá bán thực tế
                            </span>
                            <div className="d-flex align-items-center">
                                <span className="font-weight-bold text-danger mb-0" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                                    {(product.price || product.Price) ? (product.price || product.Price).toLocaleString('vi-VN') : '0'}
                                </span>
                                <span className="font-weight-bold text-danger ml-2" style={{ fontSize: '1.2rem', marginTop: '10px' }}>VND</span>
                            </div>
                        </div>

                        {/* Mô tả chi tiết */}
                        <div className="my-2 flex-grow-1">
                            <h6 className="font-weight-bold d-flex align-items-center pb-2 mb-3" style={{ color: '#334155', borderBottom: '2px solid #f1f5f9' }}>
                                <i className="bi bi-info-circle-fill text-primary mr-2"></i> Thông tin sản phẩm
                            </h6>
                            <div 
                                className="text-secondary ckeditor-content" 
                                style={{ lineHeight: '1.8', fontSize: '0.95rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}
                                dangerouslySetInnerHTML={{ 
                                    __html: (() => {
                                        let rawHtml = product.description || product.Description;
                                        if (!rawHtml) return '<p class="text-muted italic">Sản phẩm này chưa được cập nhật mô tả chi tiết từ hệ thống.</p>';
                                        
                                        // Fix lỗi hình ảnh CKEditor: Chuyển src="/uploads/..." thành absolute URL
                                        const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://localhost:7243';
                                        return rawHtml.replace(/src="\/uploads\//g, `src="${baseUrl}/uploads/`);
                                    })()
                                }} 
                            />
                        </div>

                        {/* Số lượng tồn kho và nút mua */}
                        <div className="mt-4 pt-4 border-top">
                            <div className="d-flex align-items-center mb-3">
                                <span className="font-weight-bold mr-2" style={{ color: '#64748b' }}>Trạng thái kho:</span>
                                <span className="badge px-3 py-2 font-weight-bold" style={{ backgroundColor: (product.stockQuantity ?? product.StockQuantity ?? 0) > 0 ? '#10b981' : '#ef4444', color: 'white', borderRadius: '8px' }}>
                                    {(product.stockQuantity ?? product.StockQuantity ?? 0) > 0 ? `Còn ${product.stockQuantity ?? product.StockQuantity ?? 0} sản phẩm` : 'Đã hết hàng'}
                                </span>
                            </div>
                            
                            <div className="d-flex flex-wrap align-items-center" style={{ gap: '20px' }}>
                                {/* Ô Nhập Số Lượng */}
                                <div className="input-group shadow-sm" style={{ width: '160px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                    <div className="input-group-prepend">
                                        <button 
                                            className="btn btn-light font-weight-bold px-3" 
                                            type="button" 
                                            style={{ backgroundColor: '#f8fafc', border: 'none', borderRight: '1px solid #e2e8f0', color: '#475569', fontSize: '1.2rem' }}
                                            onClick={() => setQuantity(q => Math.max(1, (parseInt(q) || 1) - 1))}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <input 
                                        type="number" 
                                        className="form-control text-center font-weight-bold border-0" 
                                        style={{ fontSize: '1.1rem', color: '#1e293b', backgroundColor: 'white', boxShadow: 'none' }}
                                        value={quantity} 
                                        onChange={e => {
                                            const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
                                            if (e.target.value === '') {
                                                setQuantity('');
                                                return;
                                            }
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) return;
                                            if (val > stock) val = stock;
                                            setQuantity(val);
                                        }}
                                        onBlur={() => {
                                            if (quantity === '' || quantity < 1) {
                                                setQuantity(1);
                                            }
                                        }}
                                        min="1" 
                                        max={product.stockQuantity ?? product.StockQuantity ?? 0}
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-light font-weight-bold px-3" 
                                            type="button" 
                                            style={{ backgroundColor: '#f8fafc', border: 'none', borderLeft: '1px solid #e2e8f0', color: '#475569', fontSize: '1.2rem' }}
                                            onClick={() => {
                                                const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
                                                setQuantity(q => Math.min(stock, (parseInt(q) || 0) + 1));
                                            }}
                                            disabled={(parseInt(quantity) || 0) >= (product.stockQuantity ?? product.StockQuantity ?? 0)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Nút Mua */}
                                <button 
                                    className="btn font-weight-bold shadow px-4 py-3 flex-grow-1" 
                                    type="button" 
                                    style={{ 
                                        borderRadius: '12px', 
                                        background: (product.stockQuantity ?? product.StockQuantity ?? 0) > 0 ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : '#94a3b8', 
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={e => { if((product.stockQuantity ?? product.StockQuantity ?? 0) > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={e => { if((product.stockQuantity ?? product.StockQuantity ?? 0) > 0) e.currentTarget.style.transform = 'translateY(0)' }}
                                    onClick={handleAddToCart} 
                                    disabled={(product.stockQuantity ?? product.StockQuantity ?? 0) === 0}
                                >
                                    <i className="bi bi-cart-plus-fill mr-2" style={{ fontSize: '1.2rem' }}></i> 
                                    { (product.stockQuantity ?? product.StockQuantity ?? 0) > 0 ? "Thêm Vào Giỏ Hàng" : "Đã Hết Hàng" }
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;