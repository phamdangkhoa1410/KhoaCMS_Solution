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

    return (
        <div className="container-fluid p-0 my-3">
            {/* Nút quay lại trang cửa hàng nhanh */}
            <Link to="/products" className="btn btn-outline-dark btn-sm font-weight-bold mb-4 shadow-sm">
                <i className="bi bi-arrow-left mr-2"></i> Quay lại cửa hàng
            </Link>

            {/* Khung chi tiết mặt hàng đổ bằng Bootstrap 4 Grid */}
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden bg-white p-4">
                <div className="row align-items-center">

                    {/* KHỐI TRÁI: Hình ảnh sản phẩm lớn */}
                    <div className="col-md-5 mb-4 mb-md-0">
                        <div className="bg-light p-3 border rounded-lg d-flex align-items-center justify-content-center" style={{ minHeight: '350px' }}>
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://localhost:7243${product.imageUrl}`}
                                    alt={product.name}
                                    className="img-fluid rounded shadow-sm object-cover"
                                    style={{ maxHeight: '330px' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x350?text=Fashion+Boutique';
                                    }}
                                />
                            ) : (
                                <i className="bi bi-image text-muted" style={{ fontSize: '4rem' }}></i>
                            )}
                        </div>
                    </div>

                    {/* KHỐI PHẢI: Thông tin chữ, giá tiền và nút hành động */}
                    <div className="col-md-7 px-lg-5">
                        <span className="badge badge-primary px-3 py-2 text-uppercase font-weight-bold mb-2 shadow-sm" style={{ letterSpacing: '1px' }}>
                            Mặt hàng chính hãng
                        </span>

                        <h2 className="font-weight-bold text-dark mb-3" style={{ fontSize: '2rem' }}>{product.name}</h2>

                        {/* Khu vực hiển thị giá tiền nổi bật */}
                        <div className="bg-light border-left border-danger p-3 my-3 rounded-right">
                            <span className="text-muted small d-block font-weight-bold">GIÁ BÁN THỰC TẾ:</span>
                            <span className="h3 font-weight-bold text-danger mb-0">
                                {product.price ? product.price.toLocaleString('vi-VN') : '0'} VND
                            </span>
                        </div>

                        {/* Mô tả chi tiết */}
                        <div className="my-4">
                            <h6 className="font-weight-bold text-dark border-bottom pb-2">📍 Mô tả sản phẩm:</h6>
                            <p className="text-secondary small mt-2" style={{ lineHeight: '1.6' }}>
                                {product.description || 'Sản phẩm cao cấp thuộc phân hệ Fashion Boutique hiện chưa được cập nhật mô tả chi tiết từ hệ thống quản trị nội dung.'}
                            </p>
                        </div>

                        {/* Số lượng tồn kho và nút mua */}
                        <div className="d-flex align-items-center mt-4 border-top pt-3">
                            <span className="text-muted small font-weight-bold mr-4">
                                Trạng thái kho: <span className="badge badge-dark ml-1">Còn {product.stockQuantity ?? 0} cái</span>
                            </span>
                            <button className="btn btn-danger btn-lg font-weight-bold px-4 shadow" type="button">
                                <i className="bi bi-cart-plus-fill mr-2"></i> Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;