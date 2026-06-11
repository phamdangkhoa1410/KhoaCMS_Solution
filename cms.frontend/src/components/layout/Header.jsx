/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Header.jsx
 * Chức năng: Thanh điều hướng Cyberpunk/AI Premium tận dụng triệt để hiệu ứng dập khối và phát sáng
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại để kích hoạt trạng thái Active

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark py-3 header-cyber-container">
            <div className="container">

                {/* 🚀 1. LOGO AI PREMIUM PHÁT SÁNG */}
                <Link to="/" className="outer-cont flex text-decoration-none mr-4">
                    <svg viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                        <g fill="none">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                            <path d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2" fill="currentColor"></path>
                        </g>
                    </svg>
                    <span className="font-weight-bold" style={{ letterSpacing: '0.5px' }}>KHOA-LAPTOP</span>
                </Link>

                {/* 🚀 2. HỆ THỐNG MENU HOVER AI GLOW EFFECT */}
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav mx-auto cyber-nav-list">
                        <li className="nav-item m-1">
                            <Link className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${location.pathname === '/' ? 'active-ai' : ''}`} to="/">
                                <i className="bi bi-house-door mr-1"></i> Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item m-1">
                            <Link className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${location.pathname === '/products' ? 'active-ai' : ''}`} to="/products">
                                <i className="bi bi-laptop mr-1"></i> Sản phẩm
                            </Link>
                        </li>
                        <li className="nav-item m-1">
                            <Link className={`nav-link text-uppercase font-weight-bold px-3 py-2 cyber-nav-btn ${location.pathname === '/blogs' ? 'active-ai' : ''}`} to="/blogs">
                                <i className="bi bi-cpu mr-1"></i> Tin tức
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🚀 3. NÚT GIỎ HÀNG TRÒN AI & THẺ MSSV */}
                <div className="d-flex align-items-center">
                    {/* Nút giỏ hàng thu nhỏ mang phong cách AI dập khối */}
                    <Link to="/cart" className="cart-ai-btn flex justify-content-center mr-4 text-decoration-none">
                        <i className="bi bi-cart3"></i>
                        <span className="badge badge-danger position-absolute cyber-cart-badge">0</span>
                    </Link>

                    <span className="badge badge-secondary p-2 font-mono" style={{ fontSize: '0.82rem', backgroundColor: '#1d2124', border: '1px solid #343a40', letterSpacing: '0.5px' }}>
                        MSSV: 2123110058
                    </span>
                </div>

            </div>
        </nav>
    );
};

export default Header;