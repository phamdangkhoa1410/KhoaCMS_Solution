import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm gọi API lấy danh mục các chủ đề bài viết (Xu hướng, Mẹo phối đồ...)
    getBlogCategories: () => {
        const url = '/Categories'; // Khớp với Route [Route("api/categories")] ở Backend
        return axiosClient.get(url);
    },

    // 2. Hàm gọi API lấy toàn bộ các bài viết thời trang trong Database
    getAllPosts: () => {
        const url = '/Posts'; // Khớp với Route [Route("api/posts")] ở Backend
        return axiosClient.get(url);
    }
};

export default blogService;