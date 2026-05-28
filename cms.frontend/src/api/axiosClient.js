import axios from 'axios';

// Khởi tạo một thực thể axios với cổng Port 7243 chính chủ của Khoa
const axiosClient = axios.create({
    baseURL: 'https://localhost:7243/api', // Đã sửa đúng cổng Port Backend của Khoa
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server là 10 giây
});

// Bộ đánh chặn Interceptor tự động bóc tách lấy thẳng cục data bên trong dữ liệu JSON
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