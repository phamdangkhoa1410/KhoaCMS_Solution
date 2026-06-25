/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

const API_URL = `${process.env.REACT_APP_API_URL}/customer`;

export const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin cá nhân.');
    }
    return data;
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Yêu cầu thất bại.');
    }
    return data;
};

export const verifyOtpResetPassword = async (email, otp, newPassword) => {
    const response = await fetch(`${API_URL}/verify-otp-reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Khôi phục mật khẩu thất bại.');
    }
    return data;
};
