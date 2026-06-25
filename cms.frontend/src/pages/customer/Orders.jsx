/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Orders = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

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

    const getStatusInfo = (status) => {
        switch (status) {
            case 0: return { color: '#f59e0b', bg: '#fef3c7', icon: 'bi-hourglass-split', text: 'Chờ duyệt' };
            case 1: return { color: '#3b82f6', bg: '#dbeafe', icon: 'bi-truck', text: 'Đang giao vận' };
            case 2: return { color: '#10b981', bg: '#d1fae5', icon: 'bi-check-circle-fill', text: 'Đã hoàn thành' };
            case 3: 
            case -1: return { color: '#ef4444', bg: '#fee2e2', icon: 'bi-x-circle-fill', text: 'Đã hủy' };
            default: return { color: '#6b7280', bg: '#f3f4f6', icon: 'bi-clock', text: 'Chờ xử lý' };
        }
    };

    const toggleDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border" style={{ color: '#667eea', width: '3rem', height: '3rem' }} role="status"></div>
            <p className="mt-3 font-weight-bold text-muted">Đang tải lịch sử mua hàng...</p>
        </div>
    );

    return (
        <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '900px' }}>
            {/* Header Phần lịch sử */}
            <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm mb-3" 
                     style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '2.5rem' }}>
                    <i className="bi bi-bag-check"></i>
                </div>
                <h2 className="font-weight-bold" style={{ color: '#2d3748' }}>Đơn Hàng Của Bạn</h2>
                <p className="text-muted">Theo dõi trạng thái và chi tiết các sản phẩm bạn đã đặt mua</p>
            </div>
            
            {error && <div className="alert alert-danger shadow-sm border-0" style={{ borderRadius: '15px' }}><i className="bi bi-exclamation-octagon-fill mr-2"></i> {error}</div>}

            {orders.length === 0 ? (
                <div className="text-center py-5 shadow-sm bg-white" style={{ borderRadius: '20px', border: '1px dashed #cbd5e0' }}>
                    <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    <h5 className="font-weight-bold mt-4 text-dark">Chưa có đơn hàng nào</h5>
                    <p className="text-muted mb-4">Có vẻ như bạn chưa từng mua sản phẩm nào tại cửa hàng.</p>
                    <a href="/" className="btn px-4 py-2 text-white font-weight-bold" style={{ borderRadius: '30px', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', border: 'none' }}>
                        <i className="bi bi-shop mr-2"></i> Bắt đầu mua sắm ngay
                    </a>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map(order => {
                        const status = getStatusInfo(order.status);
                        const isExpanded = expandedOrderId === order.id;

                        return (
                            <div key={order.id} className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', overflow: 'hidden', borderLeft: `5px solid ${status.color}`, transition: 'all 0.3s' }}>
                                {/* Header của Card */}
                                <div className="card-body p-4">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                        <div className="mb-3 mb-md-0">
                                            <div className="d-flex align-items-center mb-2">
                                                <h5 className="font-weight-bold mb-0 mr-3" style={{ color: '#2d3748' }}>
                                                    Mã đơn: <span style={{ color: '#667eea' }}>#{order.id}</span>
                                                </h5>
                                                <span className="badge px-3 py-2" style={{ backgroundColor: status.bg, color: status.color, borderRadius: '20px', fontSize: '0.85rem' }}>
                                                    <i className={`bi ${status.icon} mr-1`}></i> {status.text}
                                                </span>
                                            </div>
                                            <p className="text-muted small mb-0 font-weight-medium">
                                                <i className="bi bi-calendar-check mr-1"></i> 
                                                Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                        
                                        <div className="text-md-right border-left pl-md-4 ml-md-2" style={{ borderColor: '#edf2f7' }}>
                                            <p className="small text-muted mb-1 font-weight-bold">Tổng thanh toán</p>
                                            <h4 className="font-weight-bold text-danger mb-0">
                                                {order.totalAmount.toLocaleString('vi-VN')} đ
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Thanh điều hướng mở rộng */}
                                <div className="bg-light px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid #edf2f7', cursor: 'pointer' }} onClick={() => toggleDetails(order.id)}>
                                    <span className="text-primary font-weight-bold" style={{ fontSize: '0.95rem' }}>
                                        <i className="bi bi-box-seam mr-2"></i> {order.items.length} mặt hàng
                                    </span>
                                    <span className="text-muted font-weight-bold small" style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                                        <i className="bi bi-chevron-down" style={{ fontSize: '1.2rem' }}></i>
                                    </span>
                                </div>

                                {/* Khối chi tiết thả xuống */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 bg-light" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                        <div className="bg-white p-3 shadow-sm" style={{ borderRadius: '12px' }}>
                                            {order.items.map((item, index) => (
                                                <div key={index} className="d-flex justify-content-between align-items-center py-3 border-bottom" style={{ borderBottomColor: '#edf2f7' }}>
                                                    <div className="d-flex align-items-center">
                                                        {item.imageUrl ? (
                                                            <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://localhost:7243'}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`} alt={item.productName} className="rounded mr-3 shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #edf2f7' }} />
                                                        ) : (
                                                            <div className="rounded d-flex align-items-center justify-content-center bg-light text-secondary mr-3 shadow-sm" style={{ width: '60px', height: '60px', border: '1px solid #edf2f7' }}>
                                                                <i className="bi bi-box-seam" style={{ fontSize: '1.5rem' }}></i>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h6 className="font-weight-bold text-dark mb-1" style={{ fontSize: '1.05rem' }}>{item.productName}</h6>
                                                            <span className="badge px-2 py-1" style={{ backgroundColor: '#edf2f7', color: '#4a5568', borderRadius: '6px', fontSize: '0.8rem' }}>Số lượng: x{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-weight-bold" style={{ color: '#2d3748' }}>
                                                            {item.price.toLocaleString('vi-VN')} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-right mt-3 pt-2">
                                                <button className="btn btn-sm btn-outline-primary" style={{ borderRadius: '8px' }} onClick={() => alert("Chức năng đang phát triển!")}>
                                                    <i className="bi bi-headset mr-1"></i> Yêu cầu hỗ trợ đơn hàng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
