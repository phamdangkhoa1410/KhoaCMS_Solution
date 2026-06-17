/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/admin/BannerManager.jsx
 * Chức năng: Trang quản lý Banner Admin - Danh sách bảng, Modal Thêm/Sửa, Xóa Banner
 *            Sử dụng 100% Bootstrap 4 + CSS hiệu ứng AI Premium dập khối 3D
 */

import React, { useState, useEffect, useRef } from 'react';
import bannerService from '../../services/bannerService';

// ─── TRẠNG THÁI FORM RỖNG MẶC ĐỊNH ────────────────────────────────────────────
const EMPTY_FORM = {
    id: 0,
    imageUrl: '',
    title: '',
    description: '',
    link: '',
    position: 0,
    status: true,
};

const BannerManager = () => {
    // ─── STATE ──────────────────────────────────────────────────────────────────
    const [banners, setBanners]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [formData, setFormData]     = useState(EMPTY_FORM);
    const [isEditing, setIsEditing]   = useState(false);
    const [alertMsg, setAlertMsg]     = useState(null); // { type: 'success'|'danger', text: '' }

    // Bootstrap modal cần toggle thủ công qua DOM vì không dùng jQuery
    const modalRef = useRef(null);

    // ─── TẢI DỮ LIỆU ───────────────────────────────────────────────────────────
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await bannerService.getAllBanners();
            // An toàn mảng: kiểm tra đủ 3 lớp theo interceptor bóc vỏ của Khoa
            if (Array.isArray(res)) setBanners(res);
            else if (res && Array.isArray(res.data)) setBanners(res.data);
            else if (res && res.data && Array.isArray(res.data.data)) setBanners(res.data.data);
            else setBanners([]);
        } catch (err) {
            console.error('Lỗi tải danh sách banner:', err);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    // ─── HÀM HIỆN/ẨN MODAL (THUẦN DOM, KHÔNG JQUERY) ──────────────────────────
    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.style.display = 'flex';
            modalRef.current.classList.add('show');
            document.body.classList.add('modal-open');
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.style.display = 'none';
            modalRef.current.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    };

    // ─── HÀM MỞ MODAL THÊM MỚI ────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setFormData(EMPTY_FORM);
        setIsEditing(false);
        openModal();
    };

    // ─── HÀM MỞ MODAL SỬA (điền sẵn data cũ) ──────────────────────────────────
    const handleOpenEdit = (banner) => {
        setFormData({
            id:          banner.id   ?? banner.Id,
            imageUrl:    banner.imageUrl   ?? banner.ImageUrl   ?? '',
            title:       banner.title      ?? banner.Title      ?? '',
            description: banner.description ?? banner.Description ?? '',
            link:        banner.link       ?? banner.Link       ?? '',
            position:    banner.position   ?? banner.Position   ?? 0,
            status:      banner.status     ?? banner.Status     ?? true,
        });
        setIsEditing(true);
        openModal();
    };

    // ─── HÀM XỬ LÝ THAY ĐỔI INPUT ─────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // ─── HÀM LƯU (TẠO MỚI HOẶC CẬP NHẬT) ────────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl.trim()) {
            setAlertMsg({ type: 'warning', text: '⚠️ Vui lòng nhập URL ảnh banner trước khi lưu!' });
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...formData,
                position: Number(formData.position),
            };

            if (isEditing) {
                await bannerService.updateBanner(formData.id, payload);
                setAlertMsg({ type: 'success', text: `✅ Đã cập nhật banner "${formData.title || 'Không tên'}" thành công!` });
            } else {
                await bannerService.createBanner(payload);
                setAlertMsg({ type: 'success', text: `✅ Đã thêm banner mới "${formData.title || 'Không tên'}" vào hệ thống!` });
            }

            closeModal();
            fetchBanners();
        } catch (err) {
            console.error('Lỗi lưu banner:', err);
            setAlertMsg({ type: 'danger', text: '❌ Hệ thống gặp lỗi, không lưu được banner. Vui lòng thử lại.' });
        } finally {
            setSaving(false);
        }
    };

    // ─── HÀM XÓA BANNER ────────────────────────────────────────────────────────
    const handleDelete = async (banner) => {
        const name = banner.title ?? banner.Title ?? `ID ${banner.id ?? banner.Id}`;
        if (!window.confirm(`🗑️ Bạn có chắc muốn XÓA VĨNH VIỄN banner "${name}" khỏi hệ thống không?`)) return;

        try {
            const id = banner.id ?? banner.Id;
            await bannerService.deleteBanner(id);
            setAlertMsg({ type: 'success', text: `✅ Đã xóa banner "${name}" thành công!` });
            fetchBanners();
        } catch (err) {
            console.error('Lỗi xóa banner:', err);
            setAlertMsg({ type: 'danger', text: '❌ Không xóa được banner. Có thể đã bị xóa hoặc lỗi kết nối API.' });
        }
    };

    // ─── TỰ ĐÓNG ALERT SAU 4 GIÂY ──────────────────────────────────────────────
    useEffect(() => {
        if (!alertMsg) return;
        const t = setTimeout(() => setAlertMsg(null), 4000);
        return () => clearTimeout(t);
    }, [alertMsg]);

    // ─── RENDER ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '28px' }}>

            {/* ── TIÊU ĐỀ TRANG ADMIN ── */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="font-weight-bold mb-1" style={{ color: '#1a1d23', fontSize: '1.4rem' }}>
                        <i className="bi bi-images mr-2 text-primary"></i>Quản lý Banner Slider
                    </h4>
                    <p className="text-muted mb-0 small">
                        Thêm, sửa, xóa banner hiển thị trên trang chủ — tổng: <strong>{banners.length}</strong> banner
                    </p>
                </div>
                <button
                    id="btn-add-banner"
                    className="btn btn-primary font-weight-bold shadow-sm"
                    style={{ borderRadius: '10px', padding: '10px 20px', fontSize: '0.88rem' }}
                    onClick={handleOpenAdd}
                >
                    <i className="bi bi-plus-circle-fill mr-2"></i>Thêm Banner Mới
                </button>
            </div>

            {/* ── THÔNG BÁO KẾT QUẢ THAO TÁC ── */}
            {alertMsg && (
                <div
                    className={`alert alert-${alertMsg.type} alert-dismissible fade show shadow-sm mb-4`}
                    role="alert"
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                >
                    {alertMsg.text}
                    <button type="button" className="close" onClick={() => setAlertMsg(null)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}

            {/* ── BẢNG DANH SÁCH BANNER ── */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                <div
                    className="card-header d-flex align-items-center border-0 py-3"
                    style={{ background: 'linear-gradient(135deg, #0b0e11 0%, #1a2030 100%)' }}
                >
                    <i className="bi bi-list-ul text-info mr-2"></i>
                    <span className="font-weight-bold text-white" style={{ fontSize: '0.9rem' }}>
                        Danh sách Banner trong Database
                    </span>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <div className="text-muted small">Đang tải dữ liệu từ SQL Server...</div>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-image-alt text-muted d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
                            <p className="text-muted mb-3">Chưa có banner nào trong hệ thống.</p>
                            <button className="btn btn-outline-primary btn-sm" onClick={handleOpenAdd}>
                                <i className="bi bi-plus mr-1"></i>Thêm banner đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0" style={{ fontSize: '0.88rem' }}>
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th className="pl-4 py-3" style={{ width: '60px' }}>STT</th>
                                        <th className="py-3" style={{ width: '120px' }}>Ảnh Preview</th>
                                        <th className="py-3">Tiêu đề</th>
                                        <th className="py-3 d-none d-md-table-cell">Mô tả</th>
                                        <th className="py-3 d-none d-lg-table-cell">Link điều hướng</th>
                                        <th className="py-3 text-center" style={{ width: '80px' }}>Vị trí</th>
                                        <th className="py-3 text-center" style={{ width: '100px' }}>Trạng thái</th>
                                        <th className="py-3 text-center pr-4" style={{ width: '130px' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map((banner, idx) => {
                                        const id          = banner.id          ?? banner.Id;
                                        const imageUrl    = banner.imageUrl    ?? banner.ImageUrl    ?? '';
                                        const title       = banner.title       ?? banner.Title       ?? '(Chưa có tiêu đề)';
                                        const description = banner.description ?? banner.Description ?? '—';
                                        const link        = banner.link        ?? banner.Link        ?? '—';
                                        const position    = banner.position    ?? banner.Position    ?? 0;
                                        const status      = banner.status      ?? banner.Status;

                                        return (
                                            <tr key={id} style={{ verticalAlign: 'middle' }}>
                                                <td className="pl-4 text-muted">{idx + 1}</td>

                                                {/* Ảnh preview nhỏ */}
                                                <td>
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl.startsWith('http') ? imageUrl : `https://localhost:7243${imageUrl}`}
                                                            alt={title}
                                                            style={{
                                                                width: '90px', height: '52px',
                                                                objectFit: 'cover', borderRadius: '8px',
                                                                border: '1px solid #e9ecef',
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                                                            }}
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center bg-light"
                                                            style={{ width: '90px', height: '52px', borderRadius: '8px', border: '1px dashed #ced4da' }}
                                                        >
                                                            <i className="bi bi-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="font-weight-bold text-dark d-block">{title}</span>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: '180px' }}>
                                                        {imageUrl || 'Chưa có URL ảnh'}
                                                    </small>
                                                </td>

                                                <td className="d-none d-md-table-cell text-muted">
                                                    <span style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        maxWidth: '200px'
                                                    }}>
                                                        {description}
                                                    </span>
                                                </td>

                                                <td className="d-none d-lg-table-cell">
                                                    <a
                                                        href={link !== '—' ? link : undefined}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary small"
                                                        style={{ textDecoration: 'none', maxWidth: '150px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                    >
                                                        {link}
                                                    </a>
                                                </td>

                                                <td className="text-center">
                                                    <span className="badge badge-light border font-weight-bold" style={{ fontSize: '0.8rem' }}>
                                                        #{position}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    {status ? (
                                                        <span className="badge badge-success px-2 py-1" style={{ fontSize: '0.75rem', borderRadius: '6px' }}>
                                                            <i className="bi bi-eye-fill mr-1"></i>Hiển thị
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-secondary px-2 py-1" style={{ fontSize: '0.75rem', borderRadius: '6px' }}>
                                                            <i className="bi bi-eye-slash-fill mr-1"></i>Đã ẩn
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="text-center pr-4">
                                                    <button
                                                        id={`btn-edit-banner-${id}`}
                                                        className="btn btn-outline-primary btn-sm mr-1"
                                                        style={{ borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem' }}
                                                        onClick={() => handleOpenEdit(banner)}
                                                        title="Sửa banner này"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button
                                                        id={`btn-delete-banner-${id}`}
                                                        className="btn btn-outline-danger btn-sm"
                                                        style={{ borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem' }}
                                                        onClick={() => handleDelete(banner)}
                                                        title="Xóa banner này"
                                                    >
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                MODAL THÊM / SỬA BANNER
            ═══════════════════════════════════════════════════════════════ */}
            <div
                ref={modalRef}
                className="modal"
                tabIndex="-1"
                role="dialog"
                style={{ display: 'none', backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}
            >
                <div className="modal-dialog modal-lg" role="document" style={{ margin: '0', maxWidth: '680px', width: '95%' }}>
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>

                        {/* ── MODAL HEADER ── */}
                        <div
                            className="modal-header border-0 py-4"
                            style={{ background: 'linear-gradient(135deg, #0b0e11, #1a2030)' }}
                        >
                            <h5 className="modal-title font-weight-bold text-white mb-0">
                                {isEditing
                                    ? <><i className="bi bi-pencil-square mr-2 text-warning"></i>Chỉnh sửa Banner</>
                                    : <><i className="bi bi-plus-circle-fill mr-2 text-success"></i>Thêm Banner Mới</>
                                }
                            </h5>
                            <button type="button" className="close text-white" style={{ opacity: 1 }} onClick={closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* ── MODAL BODY: FORM ── */}
                        <form onSubmit={handleSave}>
                            <div className="modal-body p-4" style={{ backgroundColor: '#fafbfc' }}>
                                <div className="row">

                                    {/* URL ẢNH — chiếm full width */}
                                    <div className="col-12 mb-3">
                                        <label className="font-weight-bold small text-dark mb-1">
                                            <i className="bi bi-link-45deg text-primary mr-1"></i>URL Ảnh Banner <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="banner-imageUrl"
                                            type="text"
                                            name="imageUrl"
                                            className="form-control"
                                            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                                            placeholder="https://example.com/banner.jpg hoặc /uploads/banner.jpg"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            required
                                        />
                                        {/* Preview ảnh realtime */}
                                        {formData.imageUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Preview banner"
                                                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #dee2e6' }}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                    onLoad={(e)  => { e.target.style.display = 'block'; }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* TIÊU ĐỀ */}
                                    <div className="col-md-8 mb-3">
                                        <label className="font-weight-bold small text-dark mb-1">
                                            <i className="bi bi-type-h1 text-primary mr-1"></i>Tiêu đề Banner
                                        </label>
                                        <input
                                            id="banner-title"
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                                            placeholder="Ví dụ: Siêu phẩm Laptop Gaming 2026"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* VỊ TRÍ */}
                                    <div className="col-md-4 mb-3">
                                        <label className="font-weight-bold small text-dark mb-1">
                                            <i className="bi bi-sort-numeric-up text-primary mr-1"></i>Thứ tự vị trí
                                        </label>
                                        <input
                                            id="banner-position"
                                            type="number"
                                            name="position"
                                            min="0"
                                            className="form-control"
                                            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                                            value={formData.position}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* MÔ TẢ */}
                                    <div className="col-12 mb-3">
                                        <label className="font-weight-bold small text-dark mb-1">
                                            <i className="bi bi-blockquote-left text-primary mr-1"></i>Mô tả ngắn
                                        </label>
                                        <textarea
                                            id="banner-description"
                                            name="description"
                                            rows="2"
                                            className="form-control"
                                            style={{ borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }}
                                            placeholder="Mô tả ngắn hiển thị dưới tiêu đề banner..."
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* LINK ĐIỀU HƯỚNG */}
                                    <div className="col-md-8 mb-3">
                                        <label className="font-weight-bold small text-dark mb-1">
                                            <i className="bi bi-box-arrow-up-right text-primary mr-1"></i>Link điều hướng khi click
                                        </label>
                                        <input
                                            id="banner-link"
                                            type="text"
                                            name="link"
                                            className="form-control"
                                            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                                            placeholder="/products hoặc https://example.com"
                                            value={formData.link}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* TRẠNG THÁI */}
                                    <div className="col-md-4 mb-3 d-flex align-items-end">
                                        <div className="custom-control custom-switch w-100">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="banner-status"
                                                name="status"
                                                checked={formData.status}
                                                onChange={handleChange}
                                            />
                                            <label className="custom-control-label font-weight-bold small" htmlFor="banner-status" style={{ paddingTop: '2px', cursor: 'pointer' }}>
                                                {formData.status
                                                    ? <span className="text-success"><i className="bi bi-eye-fill mr-1"></i>Đang hiển thị</span>
                                                    : <span className="text-secondary"><i className="bi bi-eye-slash-fill mr-1"></i>Đang ẩn</span>
                                                }
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* ── MODAL FOOTER ── */}
                            <div className="modal-footer border-0 pt-0 pb-4 px-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '8px 20px' }}
                                    onClick={closeModal}
                                >
                                    <i className="bi bi-x-circle mr-1"></i>Hủy bỏ
                                </button>
                                <button
                                    id="btn-save-banner"
                                    type="submit"
                                    className="btn btn-primary font-weight-bold"
                                    style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '8px 28px', minWidth: '130px' }}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <><span className="spinner-border spinner-border-sm mr-2" role="status"></span>Đang lưu...</>
                                    ) : (
                                        <><i className={`bi ${isEditing ? 'bi-check2-square' : 'bi-cloud-upload-fill'} mr-2`}></i>
                                          {isEditing ? 'Cập nhật Banner' : 'Lưu Banner Mới'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Backdrop blur khi modal mở */}
        </div>
    );
};

export default BannerManager;
