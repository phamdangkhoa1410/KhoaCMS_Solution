/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/blog/index.jsx
 * Chức năng: Quản lý State lọc bài viết theo Chuyên mục và Từ khóa tìm kiếm công nghệ
 */

import React, { useState } from 'react';
import BlogCategoryList from './BlogCategoryList';
import PostList from './PostList';

const Blog = () => {
    const [selectedCategoryName, setSelectedCategoryName] = useState(null);
    const [searchBlogTerm, setSearchBlogTerm] = useState(''); // State tìm kiếm bài viết mới

    return (
        <div className="container-fluid p-0">
            <div className="row mt-3">

                {/* CỘT TRÁI (BỀ RỘNG 4): Chủ đề bài viết & Ô tìm kiếm */}
                <div className="col-md-4 mb-4">
                    <BlogCategoryList
                        selectedCategoryName={selectedCategoryName}
                        setSelectedCategoryName={setSelectedCategoryName}
                        searchBlogTerm={searchBlogTerm}
                        setSearchBlogTerm={setSearchBlogTerm}
                    />
                </div>

                {/* CỘT PHẢI (BỀ RỘNG 8): Lưới danh sách bài viết Tech */}
                <div className="col-md-8">
                    <PostList
                        selectedCategoryName={selectedCategoryName}
                        searchBlogTerm={searchBlogTerm}
                    />
                </div>

            </div>
        </div>
    );
};

export default Blog;