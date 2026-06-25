import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { forgotPassword, verifyOtpResetPassword } from '../../services/customerService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // States
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // UI States
    const [showPassword, setShowPassword] = useState(false);

    // Tự động kiểm tra nếu có email truyền sang từ trang Đăng nhập
    useEffect(() => {
        if (location.state && location.state.email) {
            const passedEmail = location.state.email;
            setEmail(passedEmail);
            autoRequestOtp(passedEmail);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const autoRequestOtp = async (targetEmail) => {
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await forgotPassword(targetEmail);
            setMessage(data.message || 'Mã OTP đã được gửi!');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Email không tồn tại trong hệ thống.');
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Vui lòng nhập Email của bạn.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await forgotPassword(email);
            setMessage(data.message || 'Mã OTP đã được gửi!');
            setStep(2); // Chuyển sang bước 2 nhập OTP
        } catch (err) {
            setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp || !newPassword) {
            setError('Vui lòng nhập mã OTP và mật khẩu mới.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await verifyOtpResetPassword(email, otp, newPassword);
            setMessage(data.message || 'Đổi mật khẩu thành công!');
            // Cho người dùng thấy thông báo 2 giây rồi về Login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Mã OTP không hợp lệ.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="card ai-auth-card border-0 shadow-lg" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-warning text-white text-center py-4 border-0 position-relative">
                    <h4 className="mb-0 font-weight-bold" style={{ letterSpacing: '1px' }}>QUÊN MẬT KHẨU</h4>
                    <p className="mb-0 mt-1 small" style={{ opacity: 0.9 }}>{step === 1 ? 'Nhập email để nhận mã OTP' : 'Xác thực mã OTP và tạo mật khẩu'}</p>
                </div>
                
                <div className="card-body p-4 p-md-5">
                    {error && <div className="alert alert-danger p-2 small text-center"><i className="bi bi-exclamation-triangle-fill mr-2"></i>{error}</div>}
                    {message && <div className="alert alert-success p-2 small text-center"><i className="bi bi-check-circle-fill mr-2"></i>{message}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp}>
                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold">Email đăng ký</label>
                                <div className="input-group ai-input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                            <i className="bi bi-envelope text-warning"></i>
                                        </span>
                                    </div>
                                    <input
                                        type="email"
                                        className="form-control border-left-0 ai-input"
                                        placeholder="khoacfvn3@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-warning text-white w-100 font-weight-bold py-2 mb-3" style={{ borderRadius: '8px' }} disabled={isLoading}>
                                {isLoading ? <><span className="spinner-border spinner-border-sm mr-2"></span> Đang gửi...</> : 'Gửi Mã OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">Mã OTP (6 chữ số)</label>
                                <div className="input-group ai-input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                            <i className="bi bi-shield-lock text-success"></i>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control border-left-0 ai-input font-weight-bold text-center"
                                        placeholder="Ví dụ: 123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', letterSpacing: '3px' }}
                                        maxLength="6"
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold">Mật khẩu mới</label>
                                <div className="input-group ai-input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                            <i className="bi bi-key text-warning"></i>
                                        </span>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control border-left-0 border-right-0 ai-input"
                                        placeholder="Nhập mật khẩu mới..."
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <span 
                                            className="input-group-text bg-white border-left-0 cursor-pointer" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success w-100 font-weight-bold py-2 mb-3" style={{ borderRadius: '8px' }} disabled={isLoading}>
                                {isLoading ? <><span className="spinner-border spinner-border-sm mr-2"></span> Đang xử lý...</> : 'Xác Nhận Đổi Mật Khẩu'}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-3">
                        <p className="mb-0 text-muted small font-weight-bold">
                            <Link to="/login" className="text-decoration-none" style={{ color: '#f59e0b' }}>
                                <i className="bi bi-arrow-left mr-1"></i> Quay lại Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
