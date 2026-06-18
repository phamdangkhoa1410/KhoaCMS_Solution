/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="container py-5">
            <h2 className="font-weight-bold mb-4" style={{ color: '#2d3748' }}>Thông tin cá nhân</h2>
            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="row mb-3">
                        <div className="col-sm-3 text-muted font-weight-bold">Họ và Tên</div>
                        <div className="col-sm-9">{user.fullName}</div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                        <div className="col-sm-3 text-muted font-weight-bold">Email</div>
                        <div className="col-sm-9">{user.email}</div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                        <div className="col-sm-3 text-muted font-weight-bold">Số điện thoại</div>
                        <div className="col-sm-9">{user.phone || 'Chưa cập nhật'}</div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                        <div className="col-sm-3 text-muted font-weight-bold">Địa chỉ</div>
                        <div className="col-sm-9">{user.address || 'Chưa cập nhật'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
