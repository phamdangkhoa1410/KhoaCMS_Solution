/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/blog/PostList.jsx
 * Chức năng: Bộ lọc bài viết kép (Từ khóa + Tên chuyên mục) kết hợp layout Tech News Luxury
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';

const PostList = ({ selectedCategoryName, searchBlogTerm }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();

                if (Array.isArray(data)) {
                    setPosts(data);
                } else if (data && Array.isArray(data.data)) {
                    setPosts(data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4 py-5 bg-white rounded shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <div className="font-weight-bold text-secondary">Đang nạp dữ liệu bài viết công nghệ...</div>
            </div>
        );
    }

    // 🎯 SIÊU BỘ LỌC KÉP TIN TỨC REAL-TIME
    const filteredPosts = posts.filter(post => {
        if (!post) return false;

        const pTitle = post.title ?? post.Title ?? "";
        const pCategoryName = post.categoryName ?? post.CategoryName ?? "";

        // TẦNG 1: Lọc theo từ khóa gõ ở ô tìm kiếm
        if (searchBlogTerm.trim() !== "") {
            const matchesSearch = pTitle.toLowerCase().includes(searchBlogTerm.toLowerCase());
            if (!matchesSearch) return false;
        }

        // TẦNG 2: Lọc theo chuyên mục đã chọn
        if (selectedCategoryName) {
            if (pCategoryName.toString().trim().toLowerCase() !== selectedCategoryName.toString().trim().toLowerCase()) {
                return false;
            }
        }

        return true;
    });

    if (filteredPosts.length === 0) {
        return (
            <div className="text-center py-5 bg-white border-0 rounded shadow-sm px-4 w-100" style={{ borderRadius: '12px' }}>
                <i className="bi bi-journal-x text-muted mb-3 d-block" style={{ fontSize: '2.5rem' }}></i>
                <p className="text-secondary font-weight-bold mb-1">Không tìm thấy bài viết nào phù hợp!</p>
                <p className="text-muted small">Khoa hãy thử gõ từ khóa công nghệ khác xem sao nhé.</p>
            </div>
        );
    }

    return (
        <div className="w-100">
            {/* Tiêu đề phân khu đã sửa chữ phù hợp hệ sinh thái Laptop */}
            <h4 className="mb-4 text-uppercase text-dark font-weight-bold border-bottom pb-3" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                <i className="bi bi-activity text-primary mr-2"></i>
                {selectedCategoryName ? `Chủ đề: ${selectedCategoryName}` : "Cẩm nang & Đánh giá phần cứng Laptop"} ({filteredPosts.length})
            </h4>

            <div className="row">
                {filteredPosts.map((post) => {
                    const id = post.id ?? post.Id;
                    if (!id) return null;

                    const title = post.title ?? post.Title ?? "Bài viết công nghệ";
                    const imgUrl = post.imageUrl ?? post.ImageUrl;
                    const catName = post.categoryName ?? post.CategoryName ?? "Đánh giá";
                    const rawDate = post.createdDate ?? post.CreatedDate;
                    const dateFormatted = rawDate ? new Date(rawDate).toLocaleDateString('vi-VN') : 'Vừa xong';

                    return (
                        <div className="col-12 mb-3" key={id}>
                            {/* Card tin tức High-Tech hiệu ứng hover bóng đổ sâu */}
                            <div className="card border-0 shadow-sm rounded-lg bg-white p-3 blog-luxury-card" style={{ borderRadius: '14px', transition: 'all 0.3s' }}>
                                <div className="row no-gutters align-items-center">

                                    {/* Khối ảnh bài viết bên trái */}
                                    <div className="col-sm-4 overflow-hidden bg-light" style={{ height: '140px', borderRadius: '10px' }}>
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl.startsWith('http') ? imgUrl : `https://localhost:7243${imgUrl}`}
                                                alt={title}
                                                className="w-100 h-100 blog-img-zoom"
                                                style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary-gradient">
                                                <i className="bi bi-cpu text-muted" style={{ fontSize: '2.2rem' }}></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Khối thông tin bên phải */}
                                    <div className="col-sm-8 pl-sm-4 pt-3 pt-sm-0">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge text-primary font-weight-bold bg-light border border-light mr-3" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px' }}>
                                                <i className="bi bi-cpu-fill text-warning mr-1"></i> {catName}
                                            </span>
                                            <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                                                <i className="bi bi-calendar3 mr-1.5 text-primary"></i> {dateFormatted}
                                            </small>
                                        </div>

                                        <h5 className="font-weight-bold text-dark mb-3 blog-title-hover" style={{ fontSize: '1.02rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }}>
                                            {title}
                                        </h5>

                                        <Link to={`/blog/${id}`} className="btn btn-link text-primary p-0 font-weight-bold small text-decoration-none hover-link-effect" style={{ fontSize: '0.82rem' }}>
                                            Khám phá cấu hình chi tiết <i className="bi bi-arrow-right-short ml-0.5"></i>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostList;