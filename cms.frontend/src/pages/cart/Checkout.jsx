/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Cart.css'; // Dùng chung CSS dập khối

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        FullName: '',
        Phone: '',
        Address: '',
        Notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Tải giỏ hàng từ API và điền sẵn thông tin user nếu đã đăng nhập
    useEffect(() => {
        const loadCart = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    navigate('/products');
                    return;
                }
                const userData = JSON.parse(userStr);
                const customerId = userData.id || userData.Id;
                
                const res = await fetch(`${process.env.REACT_APP_API_URL}/Cart/${customerId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length === 0) {
                        navigate('/products');
                        return;
                    }
                    setCartItems(data);
                } else {
                    navigate('/products');
                }
            } catch (error) {
                navigate('/products');
            }
        };
        loadCart();

        if (user) {
            setFormData({
                FullName: user.fullName || '',
                Phone: user.phone || '',
                Address: user.address || '',
                Notes: ''
            });
        }
    }, [user, navigate]);

    // Các hàm helper định dạng và đọc thuộc tính
    const formatPrice = (price) => {
        if (!price) return '0 Đ';
        return price.toLocaleString('vi-VN') + ' Đ';
    };
    const getProductPrice = (item) => item.Price || item.price || 0;
    const getProductName = (item) => item.Name || item.name || 'Sản phẩm';

    // Tổng tiền thanh toán (Chỉ hiển thị Frontend)
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (getProductPrice(item) * (item.quantity || 1));
    }, 0);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Hàm gọi API Đặt Hàng chuẩn khít 100% Entity Backend
    const handleCheckout = async (e) => {
        e.preventDefault();
        
        // Khớp tuyệt đối Entity Order Backend
        const payload = {
            CustomerId: parseInt(user ? (user.id || user.Id) : 0),
            Notes: `Họ tên: ${formData.FullName} - SĐT: ${formData.Phone} - Địa chỉ: ${formData.Address} - Ghi chú: ${formData.Notes}`,
            OrderDetails: cartItems.map(item => ({
                ProductId: parseInt(item.productId || item.id),
                Quantity: parseInt(item.quantity || 1),
                UnitPrice: parseFloat(item.price || item.Price || getProductPrice(item))
            }))
        };

        try {
            setLoading(true);
            setError(null);
            
            // Lấy token nếu có
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // Thay vì trả về object Entity bự chảng bị dính tham chiếu vòng (Object Cycle), 
            // API giờ đây chỉ trả về { success: true, message: "...", orderId: 1 } rất gọn nhẹ và phẳng.
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Order`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok || response.status === 201) {
                // Thành công: Xóa giỏ hàng dưới DB, thông báo Header cập nhật, chuyển về My Orders
                const customerId = user.id || user.Id;
                await fetch(`${process.env.REACT_APP_API_URL}/Cart/Clear/${customerId}`, { method: 'DELETE' });
                window.dispatchEvent(new Event('cartUpdate'));
                alert("🎉 Chúc mừng bạn đã đặt hàng thành công!");
                navigate('/my-orders');
            } else {
                const text = await response.text();
                throw new Error(text || 'Có lỗi xảy ra khi tạo đơn hàng.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="dark-glass-container">
                <h2 className="dark-title mb-4"><i className="bi bi-credit-card mr-2"></i> Xác Nhận Thanh Toán</h2>
                
                {error && (
                    <div className="alert alert-danger" style={{ borderRadius: '12px', background: 'rgba(255, 77, 79, 0.2)', color: '#ff4d4f', border: '1px solid rgba(255, 77, 79, 0.3)' }}>
                        <i className="bi bi-exclamation-triangle-fill mr-2"></i> Lỗi: {error}
                    </div>
                )}

                <div className="row">
                    {/* Cột trái: Form thông tin */}
                    <div className="col-lg-7 mb-4 mb-lg-0">
                        <div className="p-4" style={{ background: 'rgba(30,30,35,0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h5 className="text-white mb-4"><i className="bi bi-geo-alt-fill text-info mr-2"></i> Thông tin giao hàng</h5>
                            <form onSubmit={handleCheckout}>
                                
                                <div className="dark-input-group">
                                    <label>Họ và Tên người nhận *</label>
                                    <input 
                                        type="text" 
                                        className="dark-form-control" 
                                        name="FullName" 
                                        value={formData.FullName} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Nhập họ tên đầy đủ..." 
                                    />
                                </div>

                                <div className="dark-input-group">
                                    <label>Số điện thoại liên hệ *</label>
                                    <input 
                                        type="text" 
                                        className="dark-form-control" 
                                        name="Phone" 
                                        value={formData.Phone} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Nhập số điện thoại..." 
                                    />
                                </div>

                                <div className="dark-input-group">
                                    <label>Địa chỉ giao hàng chi tiết *</label>
                                    <textarea 
                                        className="dark-form-control" 
                                        name="Address" 
                                        rows="3" 
                                        value={formData.Address} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..." 
                                    ></textarea>
                                </div>

                                <div className="dark-input-group mb-0">
                                    <label>Ghi chú cho đơn hàng (Tùy chọn)</label>
                                    <textarea 
                                        className="dark-form-control" 
                                        name="Notes" 
                                        rows="2" 
                                        value={formData.Notes} 
                                        onChange={handleChange} 
                                        placeholder="Ghi chú giao giờ hành chính, gọi điện trước khi giao..." 
                                    ></textarea>
                                </div>

                                {/* Form Submit nấp sau nút ở tóm tắt đơn hàng để UI đẹp hơn, ta trigger nó bằng useRef hoặc đặt nút bên trong form nhưng tràn grid. Dùng chung flex hoặc layout.
                                Ở đây ta cứ để button ở dưới cùng của form */}
                                <button type="submit" id="submitOrderBtn" className="d-none">Gửi</button>
                            </form>
                        </div>
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng */}
                    <div className="col-lg-5">
                        <div className="summary-box h-100 position-sticky" style={{ top: '100px' }}>
                            <h5 className="mb-4 text-white font-weight-bold border-bottom border-secondary pb-3">
                                <i className="bi bi-box-seam text-success mr-2"></i> Danh Sách Sản Phẩm
                            </h5>
                            
                            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }} className="mb-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-dark">
                                        <div className="d-flex align-items-center" style={{ maxWidth: '70%' }}>
                                            <div className="bg-light rounded p-1 mr-3">
                                                <i className="bi bi-laptop text-dark" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <div>
                                                <div className="text-white text-truncate font-weight-bold" style={{ fontSize: '0.9rem', maxWidth: '200px' }}>
                                                    {getProductName(item)}
                                                </div>
                                                <div className="text-muted small mt-1">SL: x{item.quantity || 1}</div>
                                            </div>
                                        </div>
                                        <div className="text-info font-weight-bold" style={{ fontSize: '0.9rem' }}>
                                            {formatPrice(getProductPrice(item) * (item.quantity || 1))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-row">
                                <span className="text-muted">Hình thức thanh toán:</span>
                                <span className="text-warning font-weight-bold">Thanh toán khi nhận hàng (COD)</span>
                            </div>
                            
                            <div className="summary-total">
                                <span>TỔNG CỘNG</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>

                            <button 
                                className="btn-checkout-premium mt-4"
                                onClick={() => document.getElementById('submitOrderBtn').click()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span><i className="spinner-border spinner-border-sm mr-2"></i> Đang Xử Lý...</span>
                                ) : (
                                    <span>XÁC NHẬN ĐẶT HÀNG <i className="bi bi-check-circle-fill ml-2"></i></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
