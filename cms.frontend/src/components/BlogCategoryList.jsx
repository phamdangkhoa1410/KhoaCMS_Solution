/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * BUỔI 8: Component hiển thị danh sách Chuyên mục tin tức (Bài tập tự làm nâng cao)
 */

import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    // 1. Kho lưu trữ danh sách chuyên mục bài viết lấy từ SQL Server
    const [blogCategories, setBlogCategories] = useState([]);

    // Trạng thái tối ưu trải nghiệm người dùng trong lúc đợi API phản hồi
    const [loading, setLoading] = useState(true);

    // 2. Sử dụng useEffect để kiểm soát vòng đời gọi dữ liệu từ API
    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true); // Mở màn hình chờ

                // Gọi sang lớp Service chứa trục Axios tập trung đã làm ở Bước 1
                const data = await blogService.getBlogCategories();

                setBlogCategories(data); // Đẩy dữ liệu JSON nhận được vào State bồn chứa
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false); // Tắt màn hình chờ (Dù thành công hay thất bại)
            }
        };

        fetchBlogCategories();
    }, []); // Mảng rỗng [] ở đây cực kỳ quan trọng: Đảm bảo không xảy ra vòng lặp render vô hạn làm treo trình duyệt

    // 3. Xử lý trạng thái hiển thị giao diện tạm thời khi đang tải dữ liệu
    if (loading) {
        return <div className="text-center my-3 text-muted small font-italic">Đang nạp các chuyên mục bài viết...</div>;
    }

    // 4. Render giao diện khi đã lấy dữ liệu từ Database lên thành công
    return (
        <div className="card shadow-sm p-3 mt-4 bg-white rounded border-light">
            {/* Tiêu đề vùng chuyên mục tin tức */}
            <h5 className="card-title text-uppercase font-weight-bold text-secondary mb-3" style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                <i className="fa-solid fa-tags mr-2 text-info"></i> Chủ đề bài viết
            </h5>

            {/* Danh sách các chuyên mục hiển thị dưới dạng List Group */}
            <div className="list-group list-group-flush">
                {blogCategories.length === 0 ? (
                    <p className="text-muted small pl-2 m-0">Chưa có chủ đề tin tức nào trong Database.</p>
                ) : (
                    blogCategories.map((cate) => (
                        <a
                            key={cate.id}
                            href={`/blog/category/${cate.id}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2.5 px-2 text-dark text-decoration-none small"
                            style={{ transition: 'all 0.2s', borderRadius: '6px' }}
                        >
                            {/* In tên chuyên mục từ SQL Server lên giao diện thông qua vòng lặp .map() */}
                            <span><i className="fa-regular fa-hashtag mr-2 text-muted"></i>{cate.name}</span>
                            <span className="badge badge-light border text-muted px-2 py-1" style={{ fontSize: '10px' }}>Read</span>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogCategoryList;