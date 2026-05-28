import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối trực tiếp tới CategoriesProductsApiController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // Đường dẫn định tuyến khớp chính xác với [Route("api/categoriesproducts")] của Backend
        const url = '/categoriesproducts';

        // Gọi phương thức GET thông qua trục đường ống axiosClient đã tạo ở Bước 3
        return axiosClient.get(url);
    }
};

export default categoryProductService;