/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/blog/BlogCategoryList.jsx
 * Chức năng: Menu chủ đề tích hợp ô gõ chữ tìm kiếm bài viết công nghệ real-time
 */

import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';

const BlogCategoryList = ({
    selectedCategoryName, setSelectedCategoryName,
    searchBlogTerm, setSearchBlogTerm
}) => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();

                if (Array.isArray(data)) {
                    setBlogCategories(data);
                } else if (data && Array.isArray(data.data)) {
                    setBlogCategories(data.data);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogCategories();
    }, []);

    return (
        <div className="w-100">

            {/* KHỐI TÌM KIẾM TIN TỨC CÔNG NGHỆ */}
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-3" style={{ borderRadius: '12px' }}>
                <div className="card-body p-3">
                    <label className="font-weight-bold text-secondary small text-uppercase mb-2">
                        <i className="bi bi-search mr-2 text-primary"></i> Tìm kiếm bài viết
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control form-control-sm border-right-0"
                            placeholder="Tìm kiếm tin công nghệ, thủ thuật máy tính..."
                            value={searchBlogTerm}
                            onChange={(e) => setSearchBlogTerm(e.target.value)}
                            style={{ borderRadius: '6px 0 0 6px', fontSize: '0.88rem' }}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text bg-white border-left-0 text-muted" style={{ borderRadius: '0 6px 6px 0' }}>
                                <i className="bi bi-newspaper"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KHỐI CHỦ ĐỀ BÀI VIẾT */}
            <div className="card shadow-sm p-3 bg-white border-0" style={{ borderRadius: '12px' }}>
                <h5 className="card-title text-uppercase font-weight-bold text-secondary mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    <i className="bi bi-cpu mr-2 text-warning"></i> Chuyên mục tin tức
                </h5>

                {loading ? (
                    <div className="text-center my-3 text-muted small font-italic">
                        <span className="spinner-border spinner-border-sm mr-2"></span>Đang nạp chuyên mục...
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        <button
                            type="button"
                            onClick={() => setSelectedCategoryName(null)}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2.5 px-3 border-0 rounded mb-1 font-weight-bold ${selectedCategoryName === null ? 'bg-primary text-white' : 'text-dark'}`}
                            style={{ transition: 'all 0.2s', fontSize: '0.88rem' }}
                        >
                            <span><i className="bi bi-collection mr-2"></i> Tất cả bài viết</span>
                        </button>

                        {blogCategories.length === 0 ? (
                            <p className="text-muted small pl-2 m-0 mt-2">Chưa có chủ đề tin tức nào.</p>
                        ) : (
                            blogCategories.map((cate) => {
                                const name = cate.name || cate.Name;
                                const isSelected = selectedCategoryName === name;

                                return (
                                    <button
                                        key={cate.id || cate.Id}
                                        type="button"
                                        onClick={() => setSelectedCategoryName(name)}
                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2.5 px-3 border-0 rounded mb-1 ${isSelected ? 'bg-primary text-white font-weight-bold' : 'text-dark'}`}
                                        style={{ transition: 'all 0.2s', fontSize: '0.88rem' }}
                                    >
                                        <span><i className="bi bi-terminal mr-2 text-muted"></i>{name}</span>
                                        <span className={`badge px-2 py-1 ${isSelected ? 'badge-light text-primary' : 'badge-light border text-muted'}`} style={{ fontSize: '9px' }}>Tin tức</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCategoryList;