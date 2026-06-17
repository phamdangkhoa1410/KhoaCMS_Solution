/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Banner.jsx
 * Chức năng: Slider Banner ĐỘNG — Gọi API GET /api/banners
 *            [V3 - UPLOAD FILE]: Hiển thị ảnh thật upload từ wwwroot/uploads/banners/
 *            Tự động ghép base URL API vào đường dẫn tương đối (/uploads/banners/xxx.jpg)
 *            Slider tự chạy 4s, bo góc 12px, Prev/Next + Indicator chấm động
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

// ─── BASE URL của Backend API (Để resolve đường dẫn ảnh upload) ──────────────
const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://localhost:7243';

// ─── FALLBACK (khi DB chưa có banner hoặc API lỗi) ───────────────────────────
const FALLBACK_BANNERS = [
    {
        id: 'fb-1',
        imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1400&auto=format&fit=crop',
        title: 'Siêu Phẩm Laptop Gaming 2026',
        description: 'Trải nghiệm sức mạnh tối thượng với vi xử lý thế hệ mới nhất — ASP.NET Core Real-Time API.',
        link: '/products',
    },
    {
        id: 'fb-2',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1400&auto=format&fit=crop',
        title: 'Laptop Đồ Họa High-End RTX 4090',
        description: 'Màn hình 4K OLED — Thiết kế chuyên nghiệp không giới hạn sáng tạo.',
        link: '/products',
    },
    {
        id: 'fb-3',
        imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1400&auto=format&fit=crop',
        title: 'Xu Hướng Công Nghệ 2026',
        description: 'Cập nhật tin tức, review laptop mới nhất từ hệ thống Khoa-CMS.',
        link: '/blogs',
    },
];

// ─── HELPER: Ghép base URL cho đường dẫn tương đối (/uploads/banners/xxx.jpg)
const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    // Đường dẫn tương đối từ backend upload → ghép base URL
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

// ═════════════════════════════════════════════════════════════════════════════
const Banner = () => {
    const [banners,     setBanners]     = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused,    setIsPaused]    = useState(false);

    // ─── GỌI API LẤY BANNER ─────────────────────────────────────────────────
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await bannerService.getActiveBanners();
                let data = [];
                if (Array.isArray(res))                            data = res;
                else if (res && Array.isArray(res.data))           data = res.data;
                else if (res?.data && Array.isArray(res.data.data)) data = res.data.data;
                setBanners(data.length > 0 ? data : FALLBACK_BANNERS);
            } catch {
                setBanners(FALLBACK_BANNERS);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // ─── TỰ ĐỘNG CHUYỂN SLIDE 4s (dừng khi hover) ───────────────────────────
    useEffect(() => {
        if (banners.length === 0 || isPaused) return;
        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length, isPaused]);

    const goTo   = (idx) => setActiveIndex((idx + banners.length) % banners.length);
    const goPrev = ()    => goTo(activeIndex - 1);
    const goNext = ()    => goTo(activeIndex + 1);

    // ─── SKELETON ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                    height: '380px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
                }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border text-info mb-3"
                        role="status"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    ></div>
                    <div className="small" style={{ color: '#8b949e' }}>
                        Đang tải banner từ Database...
                    </div>
                </div>
            </div>
        );
    }

    // ─── SLIDER RENDER ──────────────────────────────────────────────────────
    return (
        <div
            className="position-relative mb-4 overflow-hidden"
            style={{
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                height: '400px',
                background: '#0d1117',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ─── CÁC SLIDE ─────────────────────────────────────────────── */}
            {banners.map((banner, idx) => {
                const id          = banner.id          ?? banner.Id          ?? idx;
                const imageUrl    = banner.imageUrl    ?? banner.ImageUrl    ?? '';
                const title       = banner.title       ?? banner.Title       ?? '';
                const description = banner.description ?? banner.Description ?? '';
                const link        = banner.link        ?? banner.Link        ?? '/products';
                const isCurrent   = idx === activeIndex;

                const imgSrc = resolveImageUrl(imageUrl)
                    ?? FALLBACK_BANNERS[idx % FALLBACK_BANNERS.length]?.imageUrl;

                return (
                    <div
                        key={id}
                        className="position-absolute w-100 h-100"
                        style={{
                            top: 0, left: 0,
                            opacity:    isCurrent ? 1 : 0,
                            zIndex:     isCurrent ? 1 : 0,
                            transition: 'opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
                            pointerEvents: isCurrent ? 'auto' : 'none',
                        }}
                    >
                        {/* Ảnh nền */}
                        <img
                            src={imgSrc}
                            alt={title || `Banner ${idx + 1}`}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            onError={(e) => {
                                e.target.src = FALLBACK_BANNERS[0].imageUrl;
                            }}
                        />

                        {/* Overlay gradient tối */}
                        <div
                            className="position-absolute w-100 h-100"
                            style={{
                                top: 0, left: 0,
                                background: 'linear-gradient(100deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)',
                            }}
                        />

                        {/* Nội dung chữ */}
                        <div
                            className="position-absolute w-100 h-100 d-flex align-items-center"
                            style={{ top: 0, left: 0, zIndex: 2 }}
                        >
                            <div className="container px-4 px-lg-5">
                                <div className="row">
                                    <div className="col-md-8 col-lg-7">

                                        {/* Badge số thứ tự */}
                                        <div className="mb-3">
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    background: 'rgba(255,255,255,0.15)',
                                                    backdropFilter: 'blur(8px)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '20px',
                                                    padding: '4px 14px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    color: '#fff',
                                                    letterSpacing: '1.5px',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                <i className="bi bi-lightning-charge-fill mr-1" style={{ color: '#fbbf24' }}></i>
                                                {String(idx + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* Tiêu đề */}
                                        {title && (
                                            <h2
                                                className="font-weight-bold text-white text-uppercase mb-3"
                                                style={{
                                                    fontSize: 'clamp(1.4rem, 3.2vw, 2.3rem)',
                                                    lineHeight: 1.18,
                                                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                                                    letterSpacing: '-0.01em',
                                                }}
                                            >
                                                {title}
                                            </h2>
                                        )}

                                        {/* Mô tả */}
                                        {description && (
                                            <p
                                                className="text-light mb-4 d-none d-sm-block"
                                                style={{
                                                    fontSize: '0.92rem',
                                                    lineHeight: 1.65,
                                                    opacity: 0.88,
                                                    maxWidth: '480px',
                                                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                                }}
                                            >
                                                {description}
                                            </p>
                                        )}

                                        {/* CTA Buttons */}
                                        <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                                            <Link
                                                to={link || '/products'}
                                                className="btn btn-primary font-weight-bold text-uppercase"
                                                style={{
                                                    borderRadius: '8px',
                                                    padding: '10px 24px',
                                                    fontSize: '0.82rem',
                                                    letterSpacing: '0.3px',
                                                    boxShadow: '0 4px 14px rgba(0,123,255,0.4)',
                                                }}
                                            >
                                                <i className="bi bi-arrow-right-circle-fill mr-2"></i>
                                                Xem ngay
                                            </Link>
                                            <Link
                                                to="/products"
                                                className="btn btn-outline-light font-weight-bold text-uppercase"
                                                style={{
                                                    borderRadius: '8px',
                                                    padding: '10px 20px',
                                                    fontSize: '0.82rem',
                                                    backdropFilter: 'blur(6px)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                <i className="bi bi-grid-fill mr-2"></i>
                                                Kho Laptop
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* ─── NÚT PREV / NEXT ─────────────────────────────────────────── */}
            <button
                type="button"
                onClick={goPrev}
                className="position-absolute border-0 bg-transparent d-flex align-items-center justify-content-center"
                style={{
                    top: '50%', left: '14px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '44px', height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.15) !important',
                    cursor: 'pointer', outline: 'none',
                    transition: 'background 0.2s ease',
                }}
                aria-label="Slide trước"
            >
                <i className="bi bi-chevron-left text-white" style={{ fontSize: '1rem' }}></i>
            </button>

            <button
                type="button"
                onClick={goNext}
                className="position-absolute border-0 bg-transparent d-flex align-items-center justify-content-center"
                style={{
                    top: '50%', right: '14px', transform: 'translateY(-50%)',
                    zIndex: 10, width: '44px', height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(6px)',
                    cursor: 'pointer', outline: 'none',
                    transition: 'background 0.2s ease',
                }}
                aria-label="Slide tiếp"
            >
                <i className="bi bi-chevron-right text-white" style={{ fontSize: '1rem' }}></i>
            </button>

            {/* ─── INDICATOR CHẤM PILL ─────────────────────────────────────── */}
            <div
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                    bottom: '18px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10, gap: '6px',
                }}
            >
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => goTo(idx)}
                        className="border-0 p-0"
                        style={{
                            cursor: 'pointer',
                            width:           idx === activeIndex ? '28px' : '8px',
                            height:          '8px',
                            borderRadius:    idx === activeIndex ? '4px' : '50%',
                            background:      idx === activeIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                            transition:      'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            outline:         'none',
                        }}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* ─── PROGRESS BAR (chạy ngược timer 4s) ─────────────────────── */}
            {!isPaused && (
                <div
                    className="position-absolute"
                    style={{ bottom: 0, left: 0, right: 0, height: '3px', zIndex: 9, background: 'rgba(255,255,255,0.1)' }}
                >
                    <div
                        key={activeIndex}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                            animation: 'bannerProgress 4s linear forwards',
                        }}
                    />
                </div>
            )}

            <style>{`
                @keyframes bannerProgress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Banner;