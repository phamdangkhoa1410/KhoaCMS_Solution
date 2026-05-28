/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * BUỔI 8: Hoàn thiện lớp Dịch vụ Blog (blogService.js) tích hợp API Chuyên mục và Chi tiết bài viết
 */

import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm gọi API lấy toàn bộ các bài viết thời trang trong Database (Phần thực hành chung)
    getAllPosts: () => {
        const url = '/Posts'; // Khớp chính xác với [Route("api/Posts")] ở Backend
        return axiosClient.get(url);
    },

    // 2. Hàm gọi API lấy chi tiết 1 bài viết theo ID (Phục vụ chức năng xem chi tiết ở buổi sau)
    getPostById: (id) => {
        const url = `/Posts/${id}`; // Gửi kèm ID lên Endpoint api/Posts/{id}
        return axiosClient.get(url);
    },

    // 3. BÀI TẬP TỰ LÀM: Hàm gọi API lấy danh mục các chủ đề bài viết (Xu hướng, Mẹo phối đồ...)
    getBlogCategories: () => {
        const url = '/Categories'; // Khớp chính xác với [Route("api/Categories")] ở Backend
        return axiosClient.get(url);
    }
};

export default blogService;