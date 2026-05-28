import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Gọi sang lớp Service vừa tạo ở Bước 1 để rút dữ liệu bài viết
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4 font-weight-bold text-secondary">Đang tải tin tức thời trang...</div>;
    }

    return (
        <div className="mt-5">
            {/* Tiêu đề vùng tin tức */}
            <h4 className="mb-4 text-uppercase text-dark font-weight-bold border-bottom pb-2" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <p className="text-muted italic">Chưa có bài viết tin tức nào trong Database.</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div className="col-12 mb-3" key={post.id}>
                            <div className="card shadow-sm border-0 rounded-lg">
                                <div className="card-body p-4">
                                    <h5 className="card-title font-weight-bold mb-2">
                                        <a href={`/post/${post.id}`} className="text-dark text-decoration-none">
                                            {post.title}
                                        </a>
                                    </h5>
                                    <p className="card-text text-secondary small mb-3">
                                        {post.shortDescription || 'Đang cập nhật nội dung tóm tắt cho bài viết...'}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center text-muted small">
                                        <span>
                                            <i className="fa-regular fa-calendar-days mr-1 text-primary"></i>
                                            {/* BIẾN ĐỔI DATETIME THÀNH CẤU TRÚC NGÀY/THÁNG/NĂM THUẦN VIỆT */}
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="badge badge-soft-info px-3 py-2 text-info bg-light rounded-pill font-weight-bold">Xem thêm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;