/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/services/bannerService.js
 * Chức năng: Lớp dịch vụ gọi API Banner - Phân tách logic gọi API ra khỏi UI Component
 */

import axiosClient from '../api/axiosClient';

const bannerService = {
    // 1. Lấy danh sách banner đang bật (Status=true) - Dành cho trang chủ
    getActiveBanners: () => {
        return axiosClient.get('/banners');
    },

    // 2. Lấy toàn bộ banner kể cả đã tắt - Dành cho Admin quản lý
    getAllBanners: () => {
        return axiosClient.get('/banners/all');
    },

    // 3. Thêm banner mới vào Database
    createBanner: (bannerData) => {
        return axiosClient.post('/banners', bannerData);
    },

    // 4. Cập nhật thông tin banner theo ID
    updateBanner: (id, bannerData) => {
        return axiosClient.put(`/banners/${id}`, bannerData);
    },

    // 5. Xóa banner theo ID
    deleteBanner: (id) => {
        return axiosClient.delete(`/banners/${id}`);
    }
};

export default bannerService;
