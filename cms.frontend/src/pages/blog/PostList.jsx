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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Chỉ chứa tối đa 5 bài viết 1 trang

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

    // Reset về trang 1 nếu người dùng thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchBlogTerm, selectedCategoryName]);

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

    // Lấy danh sách bài viết theo trang hiện tại (tối đa 5)
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const currentPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            <div className="d-flex align-items-center mb-4 pb-3 position-relative" style={{ borderBottom: '2px solid #edf2f7' }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm mr-3" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', color: 'white' }}>
                    <i className="bi bi-activity" style={{ fontSize: '1.2rem' }}></i>
                </div>
                <h4 className="text-uppercase text-dark font-weight-bold mb-0" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                    {selectedCategoryName ? `Chủ đề: ${selectedCategoryName}` : "Cẩm nang & Đánh giá công nghệ"}
                    <span className="badge ml-2" style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.8rem', verticalAlign: 'middle', borderRadius: '6px' }}>{filteredPosts.length} bài</span>
                </h4>
                <div className="position-absolute" style={{ bottom: '-2px', left: 0, width: '80px', height: '4px', background: 'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)', borderRadius: '4px' }}></div>
            </div>

            <div className="row">
                {currentPosts.map((post) => {
                    const id = post.id ?? post.Id;
                    if (!id) return null;

                    const title = post.title ?? post.Title ?? "Bài viết công nghệ";
                    const imgUrl = post.imageUrl ?? post.ImageUrl;
                    const catName = post.categoryName ?? post.CategoryName ?? "Đánh giá";
                    const rawDate = post.createdDate ?? post.CreatedDate;
                    const dateFormatted = rawDate ? new Date(rawDate).toLocaleDateString('vi-VN') : 'Vừa xong';

                    return (
                        <div className="col-12 mb-4" key={id}>
                            {/* Card tin tức High-Tech hiệu ứng hover bóng đổ sâu */}
                            <div className="card border-0 bg-white p-3" 
                                style={{ 
                                    borderRadius: '16px', 
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.08)';
                                    e.currentTarget.querySelector('.blog-img-zoom').style.transform = 'scale(1.08)';
                                    e.currentTarget.querySelector('.blog-title-hover').style.color = '#3b82f6';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                                    e.currentTarget.querySelector('.blog-img-zoom').style.transform = 'scale(1)';
                                    e.currentTarget.querySelector('.blog-title-hover').style.color = '#1e293b';
                                }}
                            >
                                <div className="row no-gutters align-items-center">

                                    {/* Khối ảnh bài viết bên trái */}
                                    <div className="col-sm-4 overflow-hidden position-relative" style={{ height: '160px', borderRadius: '12px' }}>
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl.startsWith('http') ? imgUrl : `https://localhost:7243${imgUrl}`}
                                                alt={title}
                                                className="w-100 h-100 blog-img-zoom"
                                                style={{ objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                                                <i className="bi bi-cpu text-muted" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
                                            </div>
                                        )}
                                        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
                                    </div>

                                    {/* Khối thông tin bên phải */}
                                    <div className="col-sm-8 pl-sm-4 pt-3 pt-sm-0 d-flex flex-column justify-content-center">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="font-weight-bold mr-3" style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#3b82f6', letterSpacing: '0.5px' }}>
                                                <i className="bi bi-bookmark-fill mr-1 opacity-75"></i> {catName}
                                            </span>
                                            <small style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                                                <i className="bi bi-calendar3 mr-2"></i> {dateFormatted}
                                            </small>
                                        </div>

                                        <h5 className="font-weight-bold mb-3 blog-title-hover" style={{ fontSize: '1.25rem', lineHeight: '1.5', color: '#1e293b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }}>
                                            {title}
                                        </h5>

                                        <div>
                                            <Link to={`/blog/${id}`} className="btn px-4 py-2 font-weight-bold shadow-sm" style={{ fontSize: '0.85rem', borderRadius: '8px', background: 'linear-gradient(to right, #3b82f6, #2dd4bf)', color: 'white', border: 'none' }}>
                                                Đọc tiếp <i className="bi bi-arrow-right ml-1"></i>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PHÂN TRANG BÀI VIẾT (PAGINATION) */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                                    <i className="bi bi-chevron-left"></i> Trước
                                </button>
                            </li>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                                    Sau <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default PostList;