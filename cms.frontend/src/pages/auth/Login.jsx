/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu!');
            return;
        }

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/'); // Chuyển về trang chủ sau khi đăng nhập thành công
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="card ai-auth-card border-0 shadow-lg" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-primary text-white text-center py-4 border-0 position-relative">
                    <h4 className="mb-0 font-weight-bold" style={{ letterSpacing: '1px' }}>ĐĂNG NHẬP</h4>
                    <p className="mb-0 mt-1 small" style={{ opacity: 0.8 }}>Hệ thống Khoa Laptop Premium</p>
                </div>
                <div className="card-body p-4 p-md-5">
                    {error && (
                        <div className="alert alert-danger p-2 small text-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill mr-2"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label className="text-muted small font-weight-bold">Email hoặc Tên tài khoản</label>
                            <div className="input-group ai-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        <i className="bi bi-person text-primary"></i>
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control border-left-0 ai-input"
                                    placeholder="Nhập email..."
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="text-muted small font-weight-bold">Mật khẩu</label>
                            <div className="input-group ai-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        <i className="bi bi-lock text-primary"></i>
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control border-left-0 ai-input"
                                    placeholder="Nhập mật khẩu..."
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block py-2 font-weight-bold shadow-sm"
                            style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm mr-2" role="status"></span> Đang xử lý...</span>
                            ) : (
                                <span><i className="bi bi-box-arrow-in-right mr-2"></i> Đăng nhập</span>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">Chưa có tài khoản?</p>
                        <Link to="/register" className="font-weight-bold text-decoration-none" style={{ color: '#f593e4' }}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
