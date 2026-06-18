/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Version 10.2 - Sửa lỗi định tuyến Endpoint API sản phẩm số nhiều chuẩn RESTful
 */

import axiosClient from '../api/axiosClient';

const productService = {
    // 1. Hàm gọi API lấy toàn bộ danh sách sản phẩm trong Database
    getAllProducts: () => {
        // 🔔 ĐÃ SỬA: Đổi sang '/products' viết thường số nhiều để khớp định tuyến ApiController
        const url = '/products';
        return axiosClient.get(url);
    },

    // 2. Hàm gọi API lấy chi tiết 1 sản phẩm theo ID (Dùng cho trang chi tiết sau này)
    getProductById: (id) => {
        // 🔔 ĐÃ SỬA: Đồng bộ sang dạng số nhiều '/products/{id}'
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },

    // 3. Hàm gọi API tìm kiếm, lọc và phân trang tổng hợp
    advancedSearch: (params) => {
        const url = '/products/advanced-search';
        return axiosClient.get(url, { params });
    }
};

export default productService;