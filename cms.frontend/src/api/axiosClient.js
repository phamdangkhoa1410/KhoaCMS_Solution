import axios from 'axios';

// Khởi tạo thực thể kết nối thẳng đến cổng API 7243 của Backend
const axiosClient = axios.create({
    baseURL: 'https://localhost:7243/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Bộ đánh chặn tự động bóc tách lấy thẳng cục data từ JSON trả về
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;