/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Header.jsx
 * Chức năng: Thanh điều hướng AI Premium, Glassmorphism, bo góc 12px mượt mà.
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css'; // Import file CSS hoàn toàn mới

const Header = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // ─── STATE GIỎ HÀNG ───
    const [cartCount, setCartCount] = useState(0);

    // ─── STATE DROPDOWN ───
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Load số lượng giỏ hàng
    useEffect(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('khoaCart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(total);
        } catch { setCartCount(0); }
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg premium-header" style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
            <div className="container d-flex align-items-center justify-content-between">

                {/* ================= 1. BÊN TRÁI: LOGO & NAV LINKS ================= */}
                <div className="d-flex align-items-center">
                    <Link to="/" className="text-decoration-none mr-4 d-flex align-items-center" style={{ color: '#fff' }}>
                        <svg viewBox="0 0 24 24" height="22" width="22" xmlns="http://www.w3.org/2000/svg" className="mr-2" style={{ color: '#71a4f0' }}>
                            <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" fill="currentColor"></path>
                        </svg>
                        <span className="font-weight-bold" style={{ letterSpacing: '1px', fontSize: '1.2rem' }}>KHOA<span style={{ color: '#71a4f0' }}>CMS</span></span>
                    </Link>

                    <button className="navbar-toggler border-0 d-lg-none" type="button" onClick={() => setMenuOpen(!menuOpen)}>
                        <i className="bi bi-list text-light" style={{ fontSize: '1.5rem' }}></i>
                    </button>

                    <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item mx-1">
                                <Link className={`nav-link premium-nav-link px-3 ${isActive('/') ? 'active-ai' : ''}`} to="/" onClick={() => setMenuOpen(false)}>
                                    Trang chủ
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link className={`nav-link premium-nav-link px-3 ${isActive('/products') ? 'active-ai' : ''}`} to="/products" onClick={() => setMenuOpen(false)}>
                                    Sản phẩm
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link className={`nav-link premium-nav-link px-3 ${isActive('/blogs') ? 'active-ai' : ''}`} to="/blogs" onClick={() => setMenuOpen(false)}>
                                    Tin tức
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ================= 2. Ở GIỮA: THANH TÌM KIẾM AI ================= */}
                <form className="d-none d-lg-flex mx-auto" style={{ flex: '0 1 400px' }} onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group premium-search-wrapper w-100 px-2 py-1 align-items-center">
                        <input 
                            className="form-control premium-search-input pl-3" 
                            type="search" 
                            placeholder="Khám phá công nghệ..." 
                        />
                        <button className="premium-search-btn px-3" type="submit">
                            <i className="bi bi-search" style={{ fontSize: '1.1rem' }}></i>
                        </button>
                    </div>
                </form>

                {/* ================= 3. BÊN PHẢI: GIỎ HÀNG & TÀI KHOẢN ================= */}
                <div className="d-flex align-items-center ml-auto ml-lg-0">
                    
                    {/* Icon Giỏ Hàng */}
                    <Link to="/cart" className="premium-icon-btn position-relative mr-3" title="Giỏ hàng">
                        <i className="bi bi-cart3" style={{ fontSize: '1.25rem' }}></i>
                        {cartCount > 0 && (
                            <span className="premium-cart-badge">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Khu vực Tài Khoản */}
                    {!user ? (
                        <div className="d-flex align-items-center ml-2">
                            <Link to="/login" className="btn btn-sm premium-btn-outline px-4 py-2 mr-2 font-weight-bold">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="btn btn-sm premium-btn-gradient px-4 py-2 font-weight-bold">
                                Đăng ký
                            </Link>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center position-relative" ref={dropdownRef}>
                            {/* Dòng Xin chào */}
                            <span className="premium-greeting d-none d-md-block mr-3">
                                Xin chào, <span className="font-weight-bold text-white">{user.fullName}</span>!
                            </span>
                            
                            {/* Icon Thông Tin User (Click Dropdown) */}
                            <div 
                                className="premium-icon-btn" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                title="Tài khoản của tôi"
                            >
                                <i className="bi bi-person-circle" style={{ fontSize: '1.35rem' }}></i>
                            </div>

                            {/* Menu Dropdown AI Premium */}
                            {dropdownOpen && (
                                <div className="premium-dropdown">
                                    <div className="p-3 border-bottom premium-dropdown-divider" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <div className="font-weight-bold text-white text-truncate" style={{ fontSize: '0.9rem' }}>{user.fullName}</div>
                                        <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                                    </div>
                                    <div className="py-2">
                                        <Link to="/profile" className="premium-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <i className="bi bi-person-lines-fill mr-3 text-info"></i>
                                            <span className="font-weight-bold">Thông tin cá nhân</span>
                                        </Link>
                                        <Link to="/my-orders" className="premium-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <i className="bi bi-bag-check-fill mr-3 text-success"></i>
                                            <span className="font-weight-bold">Đơn hàng của tôi</span>
                                        </Link>
                                    </div>
                                    <div className="premium-dropdown-divider"></div>
                                    <div className="py-2">
                                        <button 
                                            className="premium-dropdown-item"
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                                navigate('/login');
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right mr-3 text-danger"></i>
                                            <span className="font-weight-bold" style={{ color: '#ff4757' }}>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Header;