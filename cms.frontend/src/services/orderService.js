/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

const API_URL = 'https://localhost:7243/api/order';

export const getMyOrders = async (token) => {
    const response = await fetch(`${API_URL}/my-orders`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách đơn hàng.');
    }
    return data;
};
