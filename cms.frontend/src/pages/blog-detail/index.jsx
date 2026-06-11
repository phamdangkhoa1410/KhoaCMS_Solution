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
        <div className="container my-4">
            {/* Nút quay lại thiết kế bo góc sạch sẽ */}
            <Link to="/blogs" className="btn btn-outline-dark btn-sm font-weight-bold mb-4 rounded-pill px-3 shadow-sm" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-arrow-left mr-1.5"></i> Quay lại danh sách tin
            </Link>

            <article className="card border-0 shadow-sm bg-white p-4 p-md-5" style={{ borderRadius: '16px' }}>

                {/* 1. Tiêu đề bài viết */}
                <h1 className="font-weight-bold text-dark mb-3" style={{ fontSize: '1.8rem', lineHeight: '1.4', color: '#111' }}>
                    {title}
                </h1>

                {/* 2. Metadata chuyên mục động */}
                <div className="d-flex align-items-center text-muted small pb-3 mb-4 border-bottom">
                    {/* 🎯 HIỂN THỊ CHUẨN TÊN DANH MỤC THẬT ĐƯỢC ĐỔ TỪ DATABASE */}
                    <span className="badge badge-primary px-3 py-1.5 font-weight-bold mr-3" style={{ fontSize: '0.72rem', borderRadius: '6px', backgroundColor: '#007bff' }}>
                        <i className="bi bi-cpu-fill text-warning mr-1"></i> {catName}
                    </span>
                    <span className="font-weight-bold">
                        <i className="bi bi-calendar3 mr-1.5 text-primary"></i> Xuất bản ngày: {dateFormatted}
                    </span>
                </div>

                {/* 3. Ảnh Banner bài viết công nghệ */}
                {imgUrl && (
                    <div className="text-center mb-4 rounded-lg overflow-hidden bg-light border-0 shadow-sm" style={{ maxHeight: '420px', borderRadius: '12px' }}>
                        <img
                            src={imgUrl.startsWith('http') ? imgUrl : `https://localhost:7243${imgUrl}`}
                            alt={title}
                            className="img-fluid w-100"
                            style={{ maxHeight: '420px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                // Đổi ảnh dự phòng thành ảnh linh kiện công nghệ high-tech
                                e.target.src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop';
                            }}
                        />
                    </div>
                )}

                {/* 4. Nội dung bài viết chi tiết đổ mã HTML trơn */}
                <div
                    className="blog-content-html text-secondary mt-3 pl-1 pr-1"
                    style={{ fontSize: '1.02rem', lineHeight: '1.85', color: '#333', letterSpacing: '0.1px' }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Khối bản quyền đồ án ký tên Phạm Đăng Khoa chuyên nghiệp */}
                <div className="mt-5 pt-4 border-top text-right" style={{ borderColor: '#f2f2f2' }}>
                    <p className="font-italic small text-muted mb-0">Hệ thống quản trị nội dung CMS v12.5</p>
                    <p className="font-weight-bold small text-primary mb-0">
                        Sinh viên thực hiện: <span className="text-dark">{post.authorName ?? "Phạm Đăng Khoa"}</span> - Lớp: CCQ2311B - HITC
                    </p>
                </div>

            </article>
        </div>
    );
};

export default BlogDetail;