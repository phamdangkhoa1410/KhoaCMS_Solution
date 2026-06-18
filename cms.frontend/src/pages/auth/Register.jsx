/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation đơn giản
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng nhập đầy đủ các trường bắt buộc!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu và Xác nhận mật khẩu không khớp!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải chứa ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);
        try {
            await register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                password: formData.password
            });
            setSuccess('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
            <div className="card ai-auth-card border-0 shadow-lg" style={{ width: '100%', maxWidth: '550px', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-dark text-white text-center py-4 border-0 position-relative" style={{ background: 'linear-gradient(135deg, #12161e, #1a2030)' }}>
                    <h4 className="mb-0 font-weight-bold" style={{ letterSpacing: '1px', color: '#5bfcc4' }}>ĐĂNG KÝ TÀI KHOẢN</h4>
                    <p className="mb-0 mt-1 small text-muted">Tham gia ngay Khoa Laptop Premium</p>
                </div>
                <div className="card-body p-4 p-md-5">
                    {error && (
                        <div className="alert alert-danger p-2 small text-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill mr-2"></i> {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success p-2 small text-center" role="alert">
                            <i className="bi bi-check-circle-fill mr-2"></i> {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="text-muted small font-weight-bold">Họ và Tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control ai-input"
                                placeholder="VD: Phạm Đăng Khoa"
                                value={formData.fullName}
                                onChange={handleChange}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 form-group mb-3">
                                <label className="text-muted small font-weight-bold">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control ai-input"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-6 form-group mb-3">
                                <label className="text-muted small font-weight-bold">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control ai-input"
                                    placeholder="VD: 0912345678"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label className="text-muted small font-weight-bold">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control ai-input"
                                placeholder="Số nhà, Tên đường..."
                                value={formData.address}
                                onChange={handleChange}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 form-group mb-4">
                                <label className="text-muted small font-weight-bold">Mật khẩu *</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control ai-input"
                                    placeholder="Ít nhất 6 ký tự"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-6 form-group mb-4">
                                <label className="text-muted small font-weight-bold">Xác nhận mật khẩu *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control ai-input"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-dark btn-block py-2 font-weight-bold shadow-sm"
                            style={{ borderRadius: '8px', background: 'linear-gradient(90deg, #71a4f0, #f593e4)', border: 'none', transition: 'all 0.3s ease' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm mr-2" role="status"></span> Đang xử lý...</span>
                            ) : (
                                <span><i className="bi bi-person-plus-fill mr-2"></i> Đăng ký tài khoản</span>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">Đã có tài khoản?</p>
                        <Link to="/login" className="font-weight-bold text-decoration-none" style={{ color: '#71a4f0' }}>
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
