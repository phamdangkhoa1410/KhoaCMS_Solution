/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

const API_URL = `${process.env.REACT_APP_API_URL}/auth`; // Đã đồng bộ port 7243

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
    }
    return data;
};

export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại.');
    }
    return data;
};
