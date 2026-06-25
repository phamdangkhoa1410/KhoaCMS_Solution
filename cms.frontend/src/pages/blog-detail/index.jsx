/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/blog-detail/index.jsx
 * Chức năng: Đã gọt sạch mớ text thời trang cũ, bóc đúng tên danh mục bài viết công nghệ từ API C#
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const BlogDetail = () => {
    const { id } = useParams(); // Bốc mã ID động từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // 🔔 ĐỒNG BỘ ENDPOINT: Gọi chữ /posts viết thường khớp hoàn toàn API C#
                const response = await axiosClient.get(`/posts/${id}`);

                console.log("Dữ liệu chi tiết bài viết công nghệ:", response);

                if (response) {
                    setPost(response);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi tải chi tiết bài viết từ SQL Server:", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-5 p-5 bg-white rounded shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <div className="small font-weight-bold text-secondary">Đang nạp nội dung bài viết công nghệ...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-4">
                <div className="card border-0 shadow-sm p-4 text-center bg-white" style={{ borderRadius: '12px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-warning mb-3" style={{ fontSize: '2.5rem' }}></i>
                    <h5 className="font-weight-bold text-secondary">Không tìm thấy bài viết!</h5>
                    <p className="text-muted small">Bài viết mang mã số #{id} không tồn tại hoặc API đang phản hồi lỗi.</p>
                    <div className="mt-2">
                        <Link to="/blogs" className="btn btn-dark btn-sm rounded-pill px-4">
                            Quay lại danh sách tin
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 🎯 BỐC CHUẨN XÁC CÁC TRƯỜNG DỮ LIỆU THẬT TỪ BACKEND CỦA KHOA
    const title = post.title ?? post.Title ?? "Nội dung đang cập nhật";
    const content = post.content ?? post.Content ?? "<p className='text-muted'>Bài viết này hiện chưa có nội dung văn bản chi tiết...</p>";
    const imgUrl = post.imageUrl ?? post.ImageUrl;
    const rawDate = post.createdDate ?? post.CreatedDate;

    // 🔥 ĐÃ FIX: Lấy tên danh mục động từ SQL Server chứ không fix cứng thời trang nữa!
    const catName = post.categoryName ?? post.CategoryName ?? "Tin công nghệ";

    const dateFormatted = rawDate
        ? new Date(rawDate).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        : 'Vừa xong';

    return (
        <div className="container my-5">
            {/* Nút quay lại thiết kế bo góc sạch sẽ */}
            <Link to="/blogs" className="btn font-weight-bold mb-4 rounded-pill px-4 shadow-sm" style={{ fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#475569', transition: 'all 0.2s', border: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.transform = 'translateX(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
                <i className="bi bi-arrow-left mr-2"></i> Trở về danh mục tin
            </Link>

            <article className="card border-0 bg-white p-4 p-md-5" style={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>

                {/* 1. Tiêu đề bài viết */}
                <h1 className="font-weight-bold mb-4" style={{ fontSize: '2.2rem', lineHeight: '1.4', color: '#0f172a', letterSpacing: '-0.5px' }}>
                    {title}
                </h1>

                {/* 2. Metadata chuyên mục động */}
                <div className="d-flex align-items-center mb-5 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* 🎯 HIỂN THỊ CHUẨN TÊN DANH MỤC THẬT ĐƯỢC ĐỔ TỪ DATABASE */}
                    <span className="font-weight-bold mr-4" style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', letterSpacing: '0.5px' }}>
                        <i className="bi bi-bookmark-star-fill text-primary mr-2 opacity-75"></i> {catName}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                        <i className="bi bi-calendar-event mr-2 text-muted"></i> Xuất bản: {dateFormatted}
                    </span>
                </div>

                {/* 3. Ảnh Banner bài viết công nghệ */}
                {imgUrl && (
                    <div className="text-center mb-5 overflow-hidden bg-light border-0" style={{ maxHeight: '500px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                        <img
                            src={imgUrl.startsWith('http') ? imgUrl : `https://localhost:7243${imgUrl}`}
                            alt={title}
                            className="img-fluid w-100"
                            style={{ maxHeight: '500px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                // Đổi ảnh dự phòng thành ảnh linh kiện công nghệ high-tech
                                e.target.src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop';
                            }}
                        />
                    </div>
                )}

                {/* 4. Nội dung bài viết chi tiết đổ mã HTML trần */}
                <div
                    className="blog-content-html mt-2 pl-1 pr-1 ckeditor-content"
                    style={{ fontSize: '1.1rem', lineHeight: '1.9', color: '#334155', letterSpacing: '0.2px' }}
                    dangerouslySetInnerHTML={{ 
                        __html: (() => {
                            if (!content) return '';
                            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://localhost:7243';
                            return content.replace(/src="\/uploads\//g, `src="${baseUrl}/uploads/`);
                        })()
                    }}
                />

                {/* Khối bản quyền đồ án ký tên Phạm Đăng Khoa chuyên nghiệp */}
                <div className="mt-5 pt-4 text-right" style={{ borderTop: '2px dashed #f1f5f9' }}>
                    <div className="d-inline-block text-left" style={{ background: '#f8fafc', padding: '15px 25px', borderRadius: '12px' }}>
                        <p className="font-italic text-muted mb-1" style={{ fontSize: '0.85rem' }}>Hệ thống quản trị nội dung CMS v12.5</p>
                        <p className="font-weight-bold mb-0" style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                            Sinh viên thực hiện: <span style={{ color: '#3b82f6' }}>{post.authorName ?? "Phạm Đăng Khoa"}</span><br/>
                            <span className="font-weight-normal text-muted" style={{ fontSize: '0.85rem' }}>Lớp: CCQ2311B - HITC</span>
                        </p>
                    </div>
                </div>

            </article>
        </div>
    );
};

export default BlogDetail;