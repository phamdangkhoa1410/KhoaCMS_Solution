/*
 * Sinh viên: Phầm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/components/layout/Banner.jsx
 * Chức năng: Slider tự quét folder assets + Tự trượt bằng React Engine (Không dính lỗi nhảy # URL, không cần jQuery)
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 🎯 PHAO CỨU SINH LÕI: Tự động lội vào folder assets hốt sạch tất cả các file ảnh (.png, .jpg, .jpeg, .webp)
const importAllImages = (context) => {
    return context.keys().map(context);
};

let bannerImages = [];
try {
    bannerImages = importAllImages(require.context('../../assets', false, /\.(png|jpe?g|svg|webp)$/));
} catch (error) {
    console.warn("Chưa quét được folder assets, sử dụng ảnh mặc định.", error);
}

const Banner = () => {
    // Bộ lót phòng hờ nếu folder trống
    const finalImages = bannerImages.length > 0 ? bannerImages : [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop'
    ];

    // State quản lý chỉ số vị trí slide đang hiển thị (Mặc định tấm đầu tiên là 0)
    const [activeIndex, setActiveIndex] = useState(0);

    // 🎯 HÀM TỰ ĐỘNG CHUYỂN ẢNH THUẦN REACT (Cứ mỗi 4 giây tự nhảy sang slide kế tiếp)
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % finalImages.length);
        }, 4000); // 4000ms = 4 giây

        return () => clearInterval(timer); // Dọn dẹp bộ nhớ khi chuyển trang
    }, [finalImages.length]);

    // Hàm xử lý khi bấm nút "Trước" (Prev)
    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + finalImages.length) % finalImages.length);
    };

    // Hàm xử lý khi bấm nút "Kế tiếp" (Next)
    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % finalImages.length);
    };

    const slideContents = [
        { badge: "New Collection 2026", title: "Định Hình Phong Cách Mới", desc: "Khám phá các bộ sưu tập quần áo cao cấp độc quyền tại KHOA-SHOP.", btnText: "Mua ngay", link: "/products" },
        { badge: "Trending 2026", title: "Không Gian Thời Trang Luxury", desc: "Nâng tầm tủ đồ bằng những thiết kế tinh tế nhất kết nối API real-time.", btnText: "Khám phá ngay", link: "/products" },
        { badge: "Fashion Blogs", title: "Bí Quyết Phối Đồ Đỉnh Cao", desc: "Đón đọc tạp chí chia sẻ mẹo mặc đẹp cực chất cập nhật theo từng tuần.", btnText: "Đọc tin tức", link: "/blogs" },
        { badge: "Special Offers", title: "Ưu Đãi Độc Quyền Tuần Này", desc: "Săn ngay voucher miễn phí vận chuyển toàn quốc từ đồ án KHOA-SHOP.", btnText: "Săn deal ngay", link: "/products" },
    ];

    return (
        <div className="carousel slide shadow-sm mb-4 position-relative" style={{ borderRadius: '16px', overflow: 'hidden' }}>

            {/* 1. THANH CHẤM TRÒN CHỈ SỐ VỊ TRÍ (INDICATORS) */}
            <ol className="carousel-indicators" style={{ zIndex: 3 }}>
                {finalImages.map((_, index) => (
                    <li
                        key={index}
                        onClick={() => setActiveIndex(index)} // Bấm chấm tròn nào nhảy thẳng sang ảnh đó
                        className={index === activeIndex ? "active" : ""}
                        style={{ cursor: 'pointer' }}
                    ></li>
                ))}
            </ol>

            {/* 2. KHỐI HIỂN THỊ HÌNH ẢNH BANNER VÀ CHỮ */}
            <div className="carousel-inner">
                {finalImages.map((imgSrc, index) => {
                    const content = slideContents[index % slideContents.length];
                    const isCurrent = index === activeIndex;

                    return (
                        <div
                            key={index}
                            className={`carousel-item position-relative ${isCurrent ? "active" : ""}`}
                            style={{
                                height: '360px',
                                display: isCurrent ? 'block' : 'none', // Ép hiển thị bằng React State, không sợ kẹt ảnh
                                opacity: isCurrent ? 1 : 0,
                                transition: 'opacity 0.6s ease-in-out'
                            }}
                        >
                            {/* Lớp filter làm tối nền ảnh nhẹ */}
                            <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1, top: 0, left: 0 }}></div>

                            {/* Ảnh nền */}
                            <img src={imgSrc} className="d-block w-100 h-100" style={{ objectFit: 'cover' }} alt={`Banner Slide ${index + 1}`} />

                            {/* Khối nội dung chữ lồng lên ảnh */}
                            <div className="position-absolute w-100 h-100 top-0 d-flex align-items-center" style={{ left: 0, zIndex: 2 }}>
                                <div className="container px-4 px-md-5">
                                    <div className="row">
                                        <div className="col-md-7 col-lg-6">
                                            <span className="badge badge-warning text-uppercase font-weight-bold px-3 py-2 mb-3" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                                                {content.badge}
                                            </span>
                                            <h2 className="font-weight-bold text-white text-uppercase mb-2" style={{ fontSize: '2.2rem', lineHeight: '1.2' }}>
                                                {content.title}
                                            </h2>
                                            <p className="small text-light mb-4 d-none d-sm-block" style={{ opacity: 0.9 }}>
                                                {content.desc}
                                            </p>
                                            <div>
                                                <Link to={content.link} className="btn btn-primary font-weight-bold px-4 py-2.5 text-uppercase shadow" style={{ fontSize: '0.8rem', borderRadius: '8px' }}>
                                                    {content.btnText}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. ĐÃ SỬA CHÍ TRÚC: Chuyển sang thẻ <button type="button"> để bẻ gãy lỗi lầm nhảy đường dẫn URL */}
            <button
                type="button"
                className="carousel-control-prev border-0 bg-transparent"
                onClick={handlePrev}
                style={{ zIndex: 4, outline: 'none' }}
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Trước</span>
            </button>
            <button
                type="button"
                className="carousel-control-next border-0 bg-transparent"
                onClick={handleNext}
                style={{ zIndex: 4, outline: 'none' }}
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Tiếp</span>
            </button>
        </div>
    );
};

export default Banner;