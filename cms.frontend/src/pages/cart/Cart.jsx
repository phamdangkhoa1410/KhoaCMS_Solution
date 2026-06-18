/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Tải dữ liệu giỏ hàng từ API
    const loadCart = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);
            const customerId = user.id || user.Id;
            const res = await fetch(`https://localhost:7243/api/Cart/${customerId}`);
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
                window.dispatchEvent(new Event('cartUpdate'));
            }
        } catch (error) {
            console.error("Lỗi fetch cart:", error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // Format tiền VNĐ
    const formatPrice = (price) => {
        if (!price) return '0 Đ';
        return price.toLocaleString('vi-VN') + ' Đ';
    };

    // Hàm lấy giá an toàn
    const getProductPrice = (item) => item.Price || item.price || 0;
    const getProductName = (item) => item.Name || item.name || 'Sản phẩm không xác định';
    const getProductId = (item) => item.Id || item.id;
    const getProductImage = (item) => {
        const img = item.ImageUrl || item.imageUrl;
        if (!img) return 'https://via.placeholder.com/60';
        return img.startsWith('http') ? img : `https://localhost:7243${img}`;
    };

    // Cập nhật số lượng
    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        const user = JSON.parse(localStorage.getItem('user'));
        const customerId = user.id || user.Id;
        await fetch('https://localhost:7243/api/Cart/UpdateQuantity', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CustomerId: customerId, ProductId: id, Quantity: newQuantity })
        });
        loadCart();
    };

    // Xóa sản phẩm
    const handleRemoveItem = async (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const customerId = user.id || user.Id;
        await fetch(`https://localhost:7243/api/Cart/Remove/${customerId}/${id}`, {
            method: 'DELETE'
        });
        loadCart();
    };

    // Tính tổng tiền động
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (getProductPrice(item) * (item.quantity || 1));
    }, 0);

    return (
        <div className="container mt-5 mb-5">
            <div className="dark-glass-container">
                <h2 className="dark-title"><i className="bi bi-cart-check mr-2"></i> Giỏ Hàng Của Bạn</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
                        <h4 className="mt-3 text-muted">Giỏ hàng đang trống</h4>
                        <Link to="/products" className="btn btn-outline-info mt-3" style={{ borderRadius: '8px' }}>
                            <i className="bi bi-arrow-left"></i> Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        {/* Cột hiển thị bảng sản phẩm */}
                        <div className="col-lg-8">
                            <div className="table-responsive">
                                <table className="dark-table">
                                    <thead>
                                        <tr>
                                            <th>Sản Phẩm</th>
                                            <th className="text-center">Đơn Giá</th>
                                            <th className="text-center">Số Lượng</th>
                                            <th className="text-right">Tạm Tính</th>
                                            <th className="text-center">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => {
                                            const id = getProductId(item);
                                            const price = getProductPrice(item);
                                            const qty = item.quantity || 1;
                                            return (
                                                <tr key={`${id}-${index}`}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img 
                                                                src={getProductImage(item)} 
                                                                alt={getProductName(item)} 
                                                                style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '5px' }}
                                                            />
                                                            <span className="ml-3 font-weight-bold">{getProductName(item)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-info font-weight-bold">
                                                        {formatPrice(price)}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="qty-btn-group">
                                                            <button className="qty-btn" onClick={() => handleUpdateQuantity(id, qty - 1)}>
                                                                <i className="bi bi-dash"></i>
                                                            </button>
                                                            <input type="text" className="qty-input" value={qty} readOnly />
                                                            <button className="qty-btn" onClick={() => handleUpdateQuantity(id, qty + 1)}>
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="text-right font-weight-bold" style={{ color: '#00f0ff' }}>
                                                        {formatPrice(price * qty)}
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn-delete-cart" onClick={() => handleRemoveItem(id)} title="Xóa khỏi giỏ hàng">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Cột tóm tắt và thanh toán */}
                        <div className="col-lg-4 mt-4 mt-lg-0">
                            <div className="summary-box">
                                <h5 className="mb-4 text-white font-weight-bold border-bottom border-secondary pb-3">
                                    <i className="bi bi-receipt"></i> Tóm Tắt Đơn Hàng
                                </h5>
                                
                                <div className="summary-row">
                                    <span className="text-muted">Tổng sản phẩm:</span>
                                    <span className="font-weight-bold">{cartItems.length} Món</span>
                                </div>
                                <div className="summary-row">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-success font-weight-bold">Miễn phí</span>
                                </div>
                                
                                <div className="summary-total">
                                    <span>TỔNG TIỀN</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>

                                <button 
                                    className="btn-checkout-premium mt-4"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Tiến Hành Thanh Toán <i className="bi bi-arrow-right-circle ml-2"></i>
                                </button>

                                <Link to="/products" className="btn btn-outline-light btn-block mt-3" style={{ borderRadius: '12px' }}>
                                    <i className="bi bi-cart-plus"></i> Mua thêm sản phẩm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
