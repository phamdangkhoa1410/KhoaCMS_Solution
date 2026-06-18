import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Giả lập API gọi lấy lại mật khẩu
        setTimeout(() => {
            setMessage('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để lấy lại mật khẩu.');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-dark text-white text-center py-4 border-0 position-relative">
                    <h4 className="mb-0 font-weight-bold" style={{ letterSpacing: '1px' }}>QUÊN MẬT KHẨU</h4>
                    <p className="mb-0 mt-1 small" style={{ opacity: 0.8 }}>Nhập email để khôi phục</p>
                </div>
                <div className="card-body p-4 p-md-5 bg-white">
                    {message && (
                        <div className="alert alert-success p-2 small text-center" role="alert">
                            <i className="bi bi-check-circle-fill mr-2"></i> {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label className="text-muted small font-weight-bold">Địa chỉ Email</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        <i className="bi bi-envelope text-dark"></i>
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    className="form-control border-left-0"
                                    placeholder="Nhập email tài khoản của bạn..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-dark btn-block py-2 font-weight-bold shadow-sm"
                            style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}
                            disabled={loading || message !== ''}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm mr-2" role="status"></span> Đang gửi...</span>
                            ) : (
                                <span><i className="bi bi-send mr-2"></i> Gửi yêu cầu</span>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-4 border-top pt-3">
                        <Link to="/login" className="font-weight-bold text-decoration-none text-secondary">
                            <i className="bi bi-arrow-left mr-1"></i> Quay lại Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
