/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Header.jsx
 * Chức năng: Thanh điều hướng AI Cyberpunk Phát Sáng Premium — Logo KHOA-LAPTOP, Giỏ hàng Badge động,
 *            Dropdown Tài khoản (Thông tin cá nhân / Đơn hàng / Đăng xuất)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    // ─── STATE GIỎ HÀNG (sẽ kết nối Redux/Context sau — hiện tại demo badge động) ───
    const [cartCount, setCartCount] = useState(0);

    // ─── STATE DROPDOWN TÀI KHOẢN ───────────────────────────────────────────────
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ─── STATE MOBILE MENU ───────────────────────────────────────────────────────
    const [menuOpen, setMenuOpen] = useState(false);

    // Đóng dropdown khi bấm ra ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Demo: Load cartCount từ localStorage (nếu có hệ thống giỏ hàng)
    useEffect(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('khoaCart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(total);
        } catch { setCartCount(0); }
    }, [location]); // Re-check mỗi khi chuyển trang

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-md navbar-dark py-2 header-cyber-container" style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
            <div className="container">

                {/* ══ 1. LOGO AI PHÁT SÁNG ══════════════════════════════════════════════ */}
                <Link to="/" className="outer-cont flex text-decoration-none mr-3" id="logo-khoa-laptop">
                    <svg viewBox="0 0 24 24" height="17" width="17" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <g fill="none">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                            <path d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2" fill="currentColor"></path>
                        </g>
                    </svg>
                    <span className="font-weight-bold" style={{ letterSpacing: '0.5px' }}>KHOA-LAPTOP</span>
                </Link>

                {/* ══ HAMBURGER MOBILE ══════════════════════════════════════════════════ */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ outline: 'none', padding: '6px 10px' }}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* ══ 2. MENU ĐIỀU HƯỚNG CHÍNH ══════════════════════════════════════════ */}
                <div className={`collapse navbar-collapse justify-content-center ${menuOpen ? 'show' : ''}`} id="navbarMain">
                    <ul className="navbar-nav mx-auto cyber-nav-list">
                        <li className="nav-item m-1">
                            <Link
                                id="nav-home"
                                className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${isActive('/') ? 'active-ai' : ''}`}
                                to="/"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-house-door mr-1"></i>Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item m-1">
                            <Link
                                id="nav-products"
                                className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${isActive('/products') ? 'active-ai' : ''}`}
                                to="/products"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-laptop mr-1"></i>Sản phẩm
                            </Link>
                        </li>
                        <li className="nav-item m-1">
                            <Link
                                id="nav-blogs"
                                className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${isActive('/blogs') ? 'active-ai' : ''}`}
                                to="/blogs"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="bi bi-cpu mr-1"></i>Tin tức
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ══ 3. KHU VỰC NÚT GIỎ HÀNG + TÀI KHOẢN ════════════════════════════ */}
                <div className="d-flex align-items-center ml-auto ml-md-0">

                    {/* ── Nút GIỎ HÀNG hình tròn AI dập nổi 3D ── */}
                    <Link
                        to="/cart"
                        id="btn-cart"
                        className="cart-ai-btn d-flex align-items-center justify-content-center mr-3 text-decoration-none position-relative"
                        title="Xem giỏ hàng"
                    >
                        <i className="bi bi-cart3" style={{ fontSize: '1rem' }}></i>
                        {/* Badge số lượng — hiển thị động, ẩn nếu = 0 */}
                        {cartCount > 0 && (
                            <span
                                className="badge badge-danger position-absolute cyber-cart-badge"
                                style={{ fontSize: '0.6rem', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* ── Nút TÀI KHOẢN + DROPDOWN ── */}
                    <div className="position-relative" ref={dropdownRef}>
                        <button
                            id="btn-account"
                            type="button"
                            className="btn border-0 p-0 d-flex align-items-center"
                            style={{
                                background: 'transparent',
                                color: '#96a1b0',
                                gap: '6px',
                                fontSize: '0.9rem',
                                outline: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                            }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            title="Tài khoản của tôi"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#96a1b0'}
                        >
                            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                            <i
                                className="bi bi-chevron-down"
                                style={{
                                    fontSize: '0.65rem',
                                    transition: 'transform 0.25s ease',
                                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                            ></i>
                        </button>

                        {/* ── DROPDOWN MENU TÀI KHOẢN ── */}
                        {dropdownOpen && (
                            <div
                                className="shadow"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    minWidth: '210px',
                                    background: 'linear-gradient(145deg, #12161e, #1a2030)',
                                    border: '1px solid #2d3748',
                                    borderRadius: '12px',
                                    zIndex: 9999,
                                    overflow: 'hidden',
                                    animation: 'fadeSlideDown 0.2s ease'
                                }}
                            >
                                {/* Header dropdown */}
                                <div
                                    className="px-3 py-3 border-bottom"
                                    style={{ borderColor: '#2d3748 !important', background: 'rgba(255,255,255,0.03)' }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="d-flex align-items-center justify-content-center mr-2"
                                            style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #71a4f0, #f593e4)',
                                                fontSize: '1rem', color: '#fff'
                                            }}
                                        >
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                        <div>
                                            <div className="font-weight-bold text-white" style={{ fontSize: '0.88rem' }}>Phạm Đăng Khoa</div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>MSSV: 2123110058</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu items */}
                                <div className="py-1">
                                    <Link
                                        id="dropdown-profile"
                                        to="/profile"
                                        className="d-flex align-items-center px-4 py-2 text-decoration-none header-dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="bi bi-person-lines-fill mr-3 text-info" style={{ fontSize: '1rem', width: '16px' }}></i>
                                        <span className="text-light" style={{ fontSize: '0.88rem' }}>Thông tin cá nhân</span>
                                    </Link>

                                    <Link
                                        id="dropdown-orders"
                                        to="/my-orders"
                                        className="d-flex align-items-center px-4 py-2 text-decoration-none header-dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="bi bi-bag-check-fill mr-3 text-success" style={{ fontSize: '1rem', width: '16px' }}></i>
                                        <span className="text-light" style={{ fontSize: '0.88rem' }}>Đơn hàng của tôi</span>
                                    </Link>
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', background: '#2d3748', margin: '4px 0' }}></div>

                                {/* Đăng xuất */}
                                <div className="py-1 pb-2">
                                    <button
                                        id="btn-logout"
                                        type="button"
                                        className="d-flex align-items-center px-4 py-2 w-100 border-0 bg-transparent header-dropdown-item header-dropdown-logout"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            // TODO: Gọi hàm logout từ AuthContext tại đây
                                            console.log('Đăng xuất...');
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right mr-3 text-danger" style={{ fontSize: '1rem', width: '16px' }}></i>
                                        <span style={{ fontSize: '0.88rem', color: '#ff6b6b' }}>Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Header;