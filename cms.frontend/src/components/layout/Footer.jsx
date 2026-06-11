/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Footer.jsx
 * Chức năng: Chân trang hệ thống Showroom Laptop & Công nghệ chuẩn UX/UI đồ án tốt nghiệp
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5 mt-auto border-top" style={{ borderColor: '#2d3238', backgroundColor: '#0b0e11' }}>
            <div className="container">

                {/* PHÂN KHU 1: HỆ THỐNG CỘT THÔNG TIN CHUYÊN NGHIỆP */}
                <div className="row mb-4">

                    {/* CỘT 1: THƯƠNG HIỆU & ĐỊA CHỈ */}
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="font-weight-bold text-uppercase text-white mb-3" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
                            💻 KHOA LAPTOP SHOWROOM
                        </h5>
                        <p className="text-muted small mb-2" style={{ lineHeight: '1.6' }}>
                            Hệ thống bán lẻ Laptop Gaming, Workstation và Linh kiện phần cứng High-End chính hãng uy tín hàng đầu.
                        </p>
                        <div className="text-muted small">
                            <p className="mb-1"><i className="bi bi-geo-alt-fill text-primary mr-2"></i> 20 Tăng Nhơn Phú, P. Phước Long B, TP. Thủ Đức, TP.HCM</p>
                            <p className="mb-1"><i className="bi bi-telephone-fill text-success mr-2"></i> Hotline: 090X.XXX.XXX</p>
                            <p className="mb-0"><i className="bi bi-envelope-fill text-warning mr-2"></i> Support: khoa.pham@hitc.edu.vn</p>
                        </div>
                    </div>

                    {/* CỘT 2: CHÍNH SÁCH KHÁCH HÀNG */}
                    <div className="col-6 col-md-3 mb-4 mb-sm-0 pl-md-5">
                        <h6 className="font-weight-bold text-uppercase text-white mb-3" style={{ fontSize: '0.85rem' }}>
                            Chính sách mua hàng
                        </h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="#" className="text-muted text-decoration-none hover-white">Chính sách bảo hành 1-1</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-muted text-decoration-none hover-white">Vận chuyển & Giao nhận</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-muted text-decoration-none hover-white">Trả góp lãi suất 0%</a>
                            </li>
                            <li className="mb-0">
                                <a href="#" className="text-muted text-decoration-none hover-white">Bảo mật thông tin CMS</a>
                            </li>
                        </ul>
                    </div>

                    {/* CỘT 3: LIÊN KẾT NHANH */}
                    <div className="col-6 col-md-2 mb-4 mb-sm-0">
                        <h6 className="font-weight-bold text-uppercase text-white mb-3" style={{ fontSize: '0.85rem' }}>
                            Hệ thống
                        </h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <Link to="/" className="text-muted text-decoration-none hover-white">Trang chủ</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/products" className="text-muted text-decoration-none hover-white">Kho sản phẩm</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/blogs" className="text-muted text-decoration-none hover-white">Tin công nghệ</Link>
                            </li>
                            <li className="mb-0">
                                <Link to="/cart" className="text-muted text-decoration-none hover-white">Giỏ hàng của bạn</Link>
                            </li>
                        </ul>
                    </div>

                    {/* CỘT 4: KẾT NỐI & THANH TOÁN (HỢP CHUẨN ĐỒ ÁN) */}
                    <div className="col-md-3">
                        <h6 className="font-weight-bold text-uppercase text-white mb-3" style={{ fontSize: '0.85rem' }}>
                            Phương thức thanh toán
                        </h6>
                        <div className="d-flex flex-wrap gap-2 mb-3 text-muted" style={{ gap: '8px', fontSize: '1.4rem' }}>
                            <i className="bi bi-credit-card-2-front mr-2" title="Visa/MasterCard"></i>
                            <i className="bi bi-qr-code-scan mr-2" title="Momo/VNPAY"></i>
                            <i className="bi bi-cash mr-2" title="Thanh toán COD"></i>
                            <i className="bi bi-bank" title="Chuyển khoản"></i>
                        </div>
                        <h6 className="font-weight-bold text-uppercase text-white mb-2" style={{ fontSize: '0.82rem' }}>
                            Kênh truyền thông
                        </h6>
                        <div className="d-flex" style={{ gap: '12px' }}>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-footer-btn"><i className="bi bi-facebook"></i></a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-footer-btn"><i className="bi bi-github"></i></a>
                            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-footer-btn"><i className="bi bi-tiktok"></i></a>
                        </div>
                    </div>

                </div>

                {/* PHÂN KHU 2: THANH BẢN QUYỀN ĐỒ ÁN KÝ TÊN PHẠM ĐĂNG KHOA */}
                <div className="border-top pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between text-center text-md-left" style={{ borderColor: '#2d3238' }}>
                    <div className="small font-weight-normal text-muted mb-2 mb-md-0">
                        &copy; 2026 <span className="text-white font-weight-bold">KHOA-LAPTOP</span>. All Rights Reserved. Powered by ASP.NET Core & ReactJS.
                    </div>
                    <div className="small text-muted font-mono bg-dark p-2 rounded border" style={{ borderColor: '#2d3238', backgroundColor: '#161b22' }}>
                        Sinh viên: <span className="text-light font-weight-bold">Phạm Đăng Khoa</span> | MSSV: <span className="text-warning font-weight-bold">2123110058</span> | Lớp: <span className="text-info font-weight-bold">CCQ2311B - HITC</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;