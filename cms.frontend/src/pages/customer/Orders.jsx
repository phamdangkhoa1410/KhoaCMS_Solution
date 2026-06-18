/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';

const Orders = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders(token);
                setOrders(data);
            } catch (err) {
                setError(err.message || 'Lỗi khi tải danh sách đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container py-5">
            <h2 className="font-weight-bold mb-4" style={{ color: '#2d3748' }}>Đơn hàng của tôi</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            {orders.length === 0 ? (
                <div className="alert alert-info shadow-sm" style={{ borderRadius: '8px' }}>
                    Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                </div>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div key={order.id} className="col-12 mb-4">
                            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                                    <h5 className="font-weight-bold text-primary mb-0">Đơn hàng #{order.id}</h5>
                                    <span className={`badge ${order.status === 'Đã hoàn thành' ? 'badge-success' : 'badge-warning'} px-3 py-2`} style={{ borderRadius: '6px' }}>
                                        {order.status || 'Chờ xử lý'}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted small mb-3">Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                                    
                                    <div className="table-responsive">
                                        <table className="table table-borderless table-hover">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th className="text-center">Số lượng</th>
                                                    <th className="text-right">Đơn giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.productName}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-right text-danger font-weight-bold">{item.price.toLocaleString('vi-VN')} đ</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer bg-white text-right border-top border-light py-3">
                                    <span className="text-muted mr-3">Tổng cộng:</span>
                                    <span className="h5 font-weight-bold text-danger mb-0">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
