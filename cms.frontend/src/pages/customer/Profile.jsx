/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, setUser, token } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!formData.fullName.trim()) {
            alert("Họ và Tên không được để trống!");
            return;
        }

        try {
            setUpdating(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://localhost:7243/api'}/Customer/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                setIsEditing(false);
                alert('Cập nhật thông tin thành công!');
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            alert('Lỗi kết nối máy chủ!');
        } finally {
            setUpdating(false);
        }
    };

    if (!user) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Đang tải thông tin...</p>
        </div>
    );

    // Lấy ký tự đầu làm Avatar
    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* THẺ HỒ SƠ CHÍNH */}
                    <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        
                        {/* Ảnh bìa Gradient */}
                        <div className="position-relative" style={{ height: '180px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <div className="position-absolute" style={{ top: '20px', right: '20px' }}>
                                <span className="badge badge-light text-dark px-3 py-2" style={{ borderRadius: '30px', fontWeight: 'bold' }}>
                                    <i className="bi bi-shield-check text-success mr-1"></i> Khách hàng thân thiết
                                </span>
                            </div>
                        </div>

                        {/* Thông tin hiển thị chồng lên Ảnh bìa */}
                        <div className="card-body px-5 pb-5 text-center" style={{ marginTop: '-80px' }}>
                            <div className="d-inline-block position-relative mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow"
                                     style={{ width: '130px', height: '130px', background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)', fontSize: '3rem', fontWeight: 'bold', border: '5px solid white' }}>
                                    {initial}
                                </div>
                                <div className="position-absolute bg-success rounded-circle border border-white"
                                     style={{ width: '25px', height: '25px', bottom: '10px', right: '10px', borderWidth: '3px !important' }}
                                     title="Đang hoạt động">
                                </div>
                            </div>
                            
                            <h2 className="font-weight-bold mb-1" style={{ color: '#2d3748', fontSize: '1.8rem' }}>{user.fullName}</h2>
                            <p className="text-muted font-weight-medium mb-4"><i className="bi bi-envelope-fill text-primary mr-2"></i>{user.email}</p>

                            <div className="d-flex justify-content-center gap-3 mb-5">
                                <Link to="/my-orders" className="btn btn-outline-primary px-4 py-2" style={{ borderRadius: '10px', fontWeight: 'bold' }}>
                                    <i className="bi bi-box-seam mr-2"></i> Lịch sử Đơn hàng
                                </Link>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="btn btn-primary px-4 py-2 ml-3" style={{ borderRadius: '10px', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', border: 'none' }}>
                                        <i className="bi bi-pencil-square mr-2"></i> Chỉnh sửa thông tin
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleUpdate} disabled={updating} className="btn btn-success px-4 py-2 ml-3" style={{ borderRadius: '10px', fontWeight: 'bold' }}>
                                            {updating ? 'Đang lưu...' : <><i className="bi bi-check-circle mr-2"></i> Lưu thay đổi</>}
                                        </button>
                                        <button onClick={() => { setIsEditing(false); setFormData({ fullName: user?.fullName || '', phone: user?.phone || '', address: user?.address || '' }); }} disabled={updating} className="btn btn-danger px-4 py-2 ml-3" style={{ borderRadius: '10px', fontWeight: 'bold' }}>
                                            Hủy
                                        </button>
                                    </>
                                )}
                            </div>

                            <hr style={{ borderColor: '#edf2f7' }} />

                            {/* Chi tiết liên hệ dạng thẻ */}
                            <div className="row text-left mt-4">
                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center p-3 rounded bg-light" style={{ transition: 'all 0.3s' }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-primary bg-white shadow-sm mr-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            <i className="bi bi-person-badge"></i>
                                        </div>
                                        <div>
                                            <p className="small text-muted mb-0 font-weight-bold">Tên hiển thị</p>
                                            {isEditing ? (
                                                <input type="text" className="form-control form-control-sm mt-1" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ minWidth: '200px' }} />
                                            ) : (
                                                <h6 className="mb-0 font-weight-bold" style={{ color: '#4a5568' }}>{user.fullName}</h6>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center p-3 rounded bg-light" style={{ transition: 'all 0.3s' }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-danger bg-white shadow-sm mr-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            <i className="bi bi-envelope-paper"></i>
                                        </div>
                                        <div>
                                            <p className="small text-muted mb-0 font-weight-bold">Email liên kết</p>
                                            <h6 className="mb-0 font-weight-bold text-truncate" style={{ color: '#4a5568', maxWidth: '200px' }}>{user.email}</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center p-3 rounded bg-light" style={{ transition: 'all 0.3s' }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-success bg-white shadow-sm mr-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            <i className="bi bi-telephone"></i>
                                        </div>
                                        <div>
                                            <p className="small text-muted mb-0 font-weight-bold">Số điện thoại</p>
                                            {isEditing ? (
                                                <input type="text" className="form-control form-control-sm mt-1" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ minWidth: '200px' }} />
                                            ) : (
                                                <h6 className="mb-0 font-weight-bold" style={{ color: '#4a5568' }}>{user.phone || 'Chưa thiết lập'}</h6>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center p-3 rounded bg-light" style={{ transition: 'all 0.3s' }}>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-warning bg-white shadow-sm mr-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            <i className="bi bi-geo-alt"></i>
                                        </div>
                                        <div>
                                            <p className="small text-muted mb-0 font-weight-bold">Địa chỉ giao hàng</p>
                                            {isEditing ? (
                                                <input type="text" className="form-control form-control-sm mt-1" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ minWidth: '200px' }} />
                                            ) : (
                                                <h6 className="mb-0 font-weight-bold text-truncate" style={{ color: '#4a5568', maxWidth: '200px' }} title={user.address}>{user.address || 'Chưa thiết lập'}</h6>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
