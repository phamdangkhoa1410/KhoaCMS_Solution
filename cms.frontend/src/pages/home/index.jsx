/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/home/index.jsx
 * Chức năng: Trang Chủ hoàn chỉnh — 5 phân khu theo sơ đồ đồ án:
 *   [1] Banner Slider động (API /api/banners → ảnh upload thật từ wwwroot/uploads/banners/)
 *   [2] Card "DÀNH TỰ THỰC HÀNH" trung tâm
 *   [3] Nav Danh mục động (categoryProductService)
 *   [4] Lưới Sản phẩm NỔI BẬT (.slice 0→4) + MỚI NHẤT (.slice 4→12)
 *   [5] Grid Xu hướng Công nghệ (.slice 0→3 bài viết)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../../components/layout/Banner';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import blogService from '../../services/blogService';

// ─── BASE URL cho ảnh upload từ backend ──────────────────────────────────────
const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://localhost:7243';

const resolveImage = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
};

// ─── TIÊU ĐỀ PHÂN KHU ───────────────────────────────────────────────────────
const SectionTitle = ({ icon, title, to, linkText }) => (
    <div className="d-flex justify-content-between align-items-end mb-4 position-relative" style={{ paddingBottom: '12px' }}>
        <h4 className="font-weight-bold text-dark text-uppercase mb-0 position-relative z-index-1" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
            <span className="d-inline-flex align-items-center justify-content-center rounded-circle mr-2" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(142, 197, 252, 0.4)' }}>
                <i className={`${icon}`}></i>
            </span>
            {title}
        </h4>
        <div className="position-absolute" style={{ bottom: 0, left: 0, width: '60px', height: '4px', background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '4px' }}></div>
        <div className="position-absolute" style={{ bottom: 0, left: 0, width: '100%', height: '2px', background: '#edf2f7', zIndex: -1 }}></div>
        
        {to && (
            <Link to={to} className="btn btn-sm px-3 rounded-pill font-weight-bold text-primary" style={{ backgroundColor: '#f0f7ff', transition: 'all 0.3s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#4facfe'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#f0f7ff'; e.target.style.color = '#007bff'; }}>
                {linkText || 'Xem tất cả'} <i className="bi bi-arrow-right-short" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}></i>
            </Link>
        )}
    </div>
);

// ─── SKELETON CARD SẢN PHẨM ──────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="col-6 col-md-3 mb-4">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
                height: '180px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease-in-out infinite',
            }} />
            <div className="card-body p-3">
                <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', width: '55%', marginBottom: '8px' }} />
                <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', width: '70%' }} />
            </div>
        </div>
    </div>
);

// ─── SKELETON BÀI VIẾT ───────────────────────────────────────────────────────
const SkeletonPost = () => (
    <div className="col-md-4 mb-4">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
                height: '200px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease-in-out infinite',
            }} />
            <div className="card-body p-3">
                <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', width: '35%', marginBottom: '10px' }} />
                <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '85%' }} />
            </div>
        </div>
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════
const Home = () => {
    const navigate = useNavigate();

    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [posts,      setPosts]      = useState([]);

    const [loadingProducts,   setLoadingProducts]   = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingPosts,      setLoadingPosts]      = useState(true);

    const [activeCatId, setActiveCatId] = useState(null);

    // ── FETCH DỮ LIỆU SONG SONG ──────────────────────────────────────────────
    useEffect(() => {
        // Sản phẩm
        productService.getAllProducts().then(res => {
            let d = [];
            if (Array.isArray(res))                        d = res;
            else if (res && Array.isArray(res.data))       d = res.data;
            else if (res?.data && Array.isArray(res.data.data)) d = res.data.data;
            setProducts(d);
        }).catch(() => {}).finally(() => setLoadingProducts(false));

        // Danh mục
        categoryProductService.getAllCategoryProducts().then(res => {
            let d = [];
            if (Array.isArray(res))                        d = res;
            else if (res && Array.isArray(res.data))       d = res.data;
            else if (res?.data && Array.isArray(res.data.data)) d = res.data.data;
            setCategories(d);
        }).catch(() => {}).finally(() => setLoadingCategories(false));

        // Bài viết
        blogService.getAllPosts().then(res => {
            let d = [];
            if (Array.isArray(res))                        d = res;
            else if (res && Array.isArray(res.data))       d = res.data;
            else if (res?.data && Array.isArray(res.data.data)) d = res.data.data;
            setPosts(d);
        }).catch(() => {}).finally(() => setLoadingPosts(false));
    }, []);

    const handleCategoryClick = (catId) => {
        setActiveCatId(catId);
        navigate('/products', { state: { selectedCategoryId: catId } });
    };

    const featuredProducts = products.slice(0, 4);
    const latestProducts   = products.slice(4, 12);
    const trendingPosts    = posts.slice(0, 3);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>

            {/* ══ [1] BANNER SLIDER ĐỘNG ══════════════════════════════════════ */}
            <Banner />

            <div className="container my-5 px-3 px-md-4">

                {/* ══ [2] CARD TRUNG TÂM "DÀNH TỰ THỰC HÀNH" (PREMIUM) ════════════════ */}
                <div
                    className="text-center mb-5 py-5 px-3 position-relative overflow-hidden"
                    style={{
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                        boxShadow: '0 10px 40px rgba(0, 123, 255, 0.08)',
                        border: '1px solid rgba(0, 123, 255, 0.1)',
                    }}
                >
                    <div className="position-absolute" style={{ top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                    <div className="position-absolute" style={{ bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(142, 197, 252, 0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                    
                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ gap: '15px', position: 'relative', zIndex: 1 }}>
                        <span style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, transparent, #4facfe)', borderRadius: '2px' }} />
                        <div className="rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <i className="bi bi-mortarboard-fill" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <span style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, transparent, #00f2fe)', borderRadius: '2px' }} />
                    </div>
                    <h3 className="font-weight-bold text-dark text-uppercase mb-2 position-relative z-index-1" style={{ letterSpacing: '2px', background: '-webkit-linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Đồ Án Tốt Nghiệp CMS
                    </h3>
                    <p className="mb-0 font-weight-medium position-relative z-index-1" style={{ color: '#4a5568', fontSize: '1.05rem' }}>
                        Phạm Đăng Khoa <span className="mx-2 text-muted">|</span> MSSV: 2123110058 <span className="mx-2 text-muted">|</span> Lớp CCQ2311B <span className="mx-2 text-muted">|</span> HITC
                    </p>
                </div>

                {/* ══ [3] THANH DANH MỤC ĐỘNG ════════════════════════════════ */}
                <div className="mb-5">
                    <SectionTitle icon="bi bi-grid-3x3-gap-fill" title="Danh Mục Sản Phẩm" />
                    <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                        <button
                            id="cat-btn-all"
                            type="button"
                            className={`btn font-weight-bold text-uppercase ${activeCatId === null ? 'btn-primary' : 'btn-outline-primary'}`}
                            style={{ borderRadius: '20px', fontSize: '0.8rem', padding: '7px 18px' }}
                            onClick={() => handleCategoryClick(null)}
                        >
                            <i className="bi bi-grid-fill mr-1"></i>Tất Cả
                        </button>

                        {loadingCategories ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    height: '36px', width: '88px', borderRadius: '20px', background: '#e9ecef',
                                    animation: 'shimmer 1.4s ease-in-out infinite',
                                }} />
                            ))
                        ) : categories.map(cat => {
                            const catId   = cat.id   ?? cat.Id;
                            const catName = cat.name ?? cat.Name ?? `Danh mục ${catId}`;
                            return (
                                <button
                                    key={catId}
                                    id={`cat-btn-${catId}`}
                                    type="button"
                                    className={`btn font-weight-bold ${activeCatId === catId ? 'btn-primary' : 'bg-white text-dark shadow-sm'}`}
                                    style={{ 
                                        borderRadius: '20px', 
                                        fontSize: '0.85rem', 
                                        padding: '8px 20px', 
                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                        border: activeCatId === catId ? 'none' : '1px solid #edf2f7',
                                        background: activeCatId === catId ? 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' : 'white',
                                        color: activeCatId === catId ? 'white' : '#4a5568'
                                    }}
                                    onClick={() => handleCategoryClick(catId)}
                                    onMouseEnter={e => { if (activeCatId !== catId) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; } }}
                                    onMouseLeave={e => { if (activeCatId !== catId) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'; } }}
                                >
                                    <i className="bi bi-laptop mr-2" style={{ opacity: 0.7 }}></i>{catName}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ══ [4A] SẢN PHẨM NỔI BẬT (.slice 0,4) ════════════════════ */}
                <div className="mb-5">
                    <SectionTitle icon="bi bi-star-fill" title="Sản Phẩm Nổi Bật" to="/products" linkText="Xem thêm" />
                    <div className="row">
                        {loadingProducts
                            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
                            : featuredProducts.length === 0
                                ? (
                                    <div className="col-12">
                                        <div className="text-center py-5 bg-white rounded shadow-sm">
                                            <i className="bi bi-laptop text-muted d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
                                            <p className="text-secondary mb-0 small">Chưa có sản phẩm. Kiểm tra lại kết nối API.</p>
                                        </div>
                                    </div>
                                )
                                : featuredProducts.map(product => (
                                    <div className="col-6 col-md-3 mb-4" key={product.id ?? product.Id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))
                        }
                    </div>
                </div>

                {/* ══ [4B] SẢN PHẨM MỚI NHẤT (.slice 4,12) ══════════════════ */}
                {!loadingProducts && latestProducts.length > 0 && (
                    <div className="mb-5">
                        <SectionTitle icon="bi bi-cpu-fill" title="Sản Phẩm Mới Nhất" to="/products" linkText="Xem tất cả" />
                        <div className="row">
                            {latestProducts.map(product => (
                                <div className="col-6 col-md-3 mb-4" key={product.id ?? product.Id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ KHỐI INFO ĐỒ ÁN (AI CONTROL PANEL) ════════════════════ */}
                <div
                    className="border-0 shadow-lg position-relative overflow-hidden mb-5 p-4 p-md-5"
                    style={{
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* Glowing Orbs Background */}
                    <div className="position-absolute" style={{ top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
                    <div className="position-absolute" style={{ bottom: '-10%', right: '-5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
                    
                    <div className="row align-items-center position-relative z-index-1">
                        <div className="col-lg-8 text-white">
                            <span
                                className="badge text-uppercase font-weight-bold px-3 py-2 mb-4 d-inline-flex align-items-center"
                                style={{ fontSize: '0.75rem', letterSpacing: '1px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}
                            >
                                <i className="bi bi-cpu mr-2" style={{ fontSize: '1rem' }}></i> Kiến Trúc Hệ Thống Full-Stack
                            </span>
                            <h2 className="font-weight-bold mb-3 text-uppercase" style={{ fontSize: '1.8rem', background: '-webkit-linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>
                                KHOA LAPTOP MANAGEMENT SYSTEM
                            </h2>
                            <p className="mb-4" style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#94a3b8' }}>
                                Hệ thống thương mại điện tử toàn diện — Sức mạnh lõi từ
                                <strong className="text-white mx-1">ASP.NET Core 8 API</strong>
                                với cơ sở dữ liệu SQL Server, quản lý file thực tế tại
                                <strong className="text-white mx-1">wwwroot/uploads/</strong>,
                                kết hợp tốc độ hiển thị siêu tốc (SPA) của <strong style={{ color: '#61dafb' }}>ReactJS</strong>.
                            </p>
                            <div className="row no-gutters py-3 px-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                                <div className="col-sm-5 mb-3 mb-sm-0">
                                    <small className="d-block text-uppercase font-weight-bold mb-1" style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px' }}>Sinh viên thực hiện</small>
                                    <strong className="text-white" style={{ fontSize: '1rem' }}>Phạm Đăng Khoa</strong>
                                </div>
                                <div className="col-sm-3 mb-3 mb-sm-0">
                                    <small className="d-block text-uppercase font-weight-bold mb-1" style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px' }}>Mã SV</small>
                                    <strong className="text-white" style={{ fontSize: '1rem' }}>2123110058</strong>
                                </div>
                                <div className="col-sm-4">
                                    <small className="d-block text-uppercase font-weight-bold mb-1" style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px' }}>Lớp</small>
                                    <strong className="text-white" style={{ fontSize: '1rem' }}>CCQ2311B — HITC</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div className="d-flex flex-column" style={{ gap: '15px' }}>
                                <Link to="/products"
                                    className="btn font-weight-bold text-uppercase text-center py-3 shadow"
                                    style={{ borderRadius: '12px', fontSize: '0.9rem', background: 'linear-gradient(to right, #3b82f6, #2dd4bf)', color: 'white', border: 'none', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <i className="bi bi-controller mr-2" style={{ fontSize: '1.2rem' }}></i> Khám Phá Kho Laptop
                                </Link>
                                <Link to="/blogs"
                                    className="btn font-weight-bold text-uppercase text-center py-3"
                                    style={{ borderRadius: '12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    <i className="bi bi-newspaper mr-2" style={{ fontSize: '1.2rem' }}></i> Tin Tức Công Nghệ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ [5] XU HƯỚNG CÔNG NGHỆ (.slice 0,3) ════════════════════ */}
                <div className="mb-5">
                    <div className="text-center mb-4">
                        <span className="badge badge-primary text-uppercase font-weight-bold px-3 py-2 mb-2 d-inline-block"
                            style={{ letterSpacing: '1.5px', fontSize: '0.68rem', borderRadius: '20px' }}>
                            <i className="bi bi-rss-fill mr-1"></i>Tin Mới
                        </span>
                        <h4 className="font-weight-bold text-dark text-uppercase mb-1" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
                            Xu Hướng Công Nghệ
                        </h4>
                        <p className="text-muted small mt-1 mb-0">
                            Review và tin tức laptop mới nhất từ hệ thống Khoa-CMS
                        </p>
                    </div>

                    <div className="row">
                        {loadingPosts
                            ? [1, 2, 3].map(i => <SkeletonPost key={i} />)
                            : trendingPosts.length === 0
                                ? (
                                    <div className="col-12">
                                        <div className="text-center py-5 bg-white rounded shadow-sm">
                                            <i className="bi bi-newspaper text-muted d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
                                            <p className="text-secondary mb-0 small">Chưa có bài viết. Thêm qua trang Admin.</p>
                                        </div>
                                    </div>
                                )
                                : trendingPosts.map(post => {
                                    const postId   = post.id    ?? post.Id;
                                    const title    = post.title ?? post.Title ?? 'Bài viết';
                                    const imgUrl   = resolveImage(post.imageUrl ?? post.ImageUrl);
                                    const postDate = post.createdDate ?? post.CreatedDate;
                                    const catName  = post.categoryName ?? post.CategoryName ?? '';

                                    return (
                                        <div className="col-md-4 mb-4" key={postId}>
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                                }}
                                                onClick={() => navigate(`/blog/${postId}`)}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.1)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '';
                                                }}
                                            >
                                                {/* Ảnh bài viết */}
                                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#f0f4f8' }}>
                                                    {imgUrl ? (
                                                        <img
                                                            src={imgUrl}
                                                            alt={title}
                                                            className="w-100 h-100"
                                                            style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
                                                            onError={e => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                            <i className="bi bi-newspaper text-muted" style={{ fontSize: '3rem', opacity: 0.35 }}></i>
                                                        </div>
                                                    )}
                                                    {/* Badge danh mục */}
                                                    {catName && (
                                                        <span
                                                            className="badge badge-primary position-absolute"
                                                            style={{ top: '10px', left: '10px', fontSize: '0.65rem', borderRadius: '6px', padding: '4px 10px' }}
                                                        >
                                                            {catName}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Nội dung thẻ */}
                                                <div className="card-body p-3">
                                                    {postDate && (
                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="bi bi-calendar3 text-muted mr-1" style={{ fontSize: '0.72rem' }}></i>
                                                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>{formatDate(postDate)}</small>
                                                        </div>
                                                    )}
                                                    <h6
                                                        className="font-weight-bold mb-2"
                                                        style={{
                                                            fontSize: '0.92rem',
                                                            lineHeight: 1.45,
                                                            color: '#1a1d23',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {title}
                                                    </h6>
                                                    <Link
                                                        to={`/blog/${postId}`}
                                                        className="text-primary font-weight-bold small text-decoration-none"
                                                        style={{ fontSize: '0.78rem' }}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        Đọc thêm <i className="bi bi-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        }
                    </div>

                    {!loadingPosts && trendingPosts.length > 0 && (
                        <div className="text-center mt-3">
                            <Link
                                to="/blogs"
                                className="btn btn-outline-primary font-weight-bold"
                                style={{ borderRadius: '20px', padding: '10px 28px', fontSize: '0.85rem' }}
                            >
                                <i className="bi bi-newspaper mr-2"></i>Xem tất cả tin tức công nghệ
                            </Link>
                        </div>
                    )}
                </div>

            </div>

            {/* Shimmer keyframe */}
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default Home;