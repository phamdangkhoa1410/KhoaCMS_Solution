/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        try {
            const storedCart = JSON.parse(localStorage.getItem('khoaCart') || '[]');
            setCartItems(storedCart);
        } catch {
            setCartItems([]);
        }
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <div className="container py-5">
            <h2 className="font-weight-bold mb-4" style={{ color: '#2d3748' }}>Giỏ hàng của bạn</h2>
            
            {cartItems.length === 0 ? (
                <div className="alert alert-info shadow-sm" style={{ borderRadius: '8px' }}>
                    Giỏ hàng của bạn đang trống. <Link to="/products" className="font-weight-bold text-primary">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th className="text-center">Đơn giá</th>
                                                <th className="text-center">Số lượng</th>
                                                <th className="text-right">Thành tiền</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            {item.imageUrl && (
                                                                <img src={item.imageUrl} alt={item.name} className="img-thumbnail mr-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                                            )}
                                                            <span className="font-weight-bold">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-danger font-weight-bold">{item.price.toLocaleString('vi-VN')} đ</td>
                                                    <td className="text-center">
                                                        <span className="badge badge-secondary px-3 py-2">{item.quantity || 1}</span>
                                                    </td>
                                                    <td className="text-right text-danger font-weight-bold">
                                                        {(item.price * (item.quantity || 1)).toLocaleString('vi-VN')} đ
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-outline-danger" title="Xóa">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 bg-light" style={{ borderRadius: '12px' }}>
                            <div className="card-body p-4">
                                <h5 className="font-weight-bold mb-4 border-bottom pb-3">Tổng đơn hàng</h5>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Tạm tính:</span>
                                    <span className="font-weight-bold">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-success font-weight-bold">Miễn phí</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="font-weight-bold h5 mb-0">Thành tiền:</span>
                                    <span className="h5 font-weight-bold text-danger mb-0">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                                </div>
                                <button className="btn btn-danger btn-block py-3 font-weight-bold shadow-sm" style={{ borderRadius: '8px' }}>
                                    Tiến hành thanh toán
                                </button>
                                <div className="text-center mt-3">
                                    <Link to="/products" className="small text-muted text-decoration-none">
                                        <i className="bi bi-arrow-left mr-1"></i> Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
