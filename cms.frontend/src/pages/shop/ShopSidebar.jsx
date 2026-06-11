/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/shop/ShopSidebar.jsx
 * Chức năng: Sidebar tích hợp ô nhập giá trần và thanh kéo co giãn tự động theo giá nhập
 */

import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';
import productService from '../../services/productService';

const ShopSidebar = ({
    selectedCategoryId, setSelectedCategoryId,
    searchTerm, setSearchTerm,
    priceInput, setPriceInput,
    priceRange, setPriceRange
}) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeAccordionId, setActiveAccordionId] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [resCategories, resProducts] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts()
                ]);

                if (Array.isArray(resCategories)) setCategoryProducts(resCategories);
                else if (resCategories && Array.isArray(resCategories.data)) setCategoryProducts(resCategories.data);

                if (Array.isArray(resProducts)) setAllProducts(resProducts);
                else if (resProducts && Array.isArray(resProducts.data)) setAllProducts(resProducts.data);
                else if (resProducts && resProducts.data && Array.isArray(resProducts.data.data)) setAllProducts(resProducts.data.data);

            } catch (error) {
                console.error("Lỗi tải dữ liệu Sidebar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // 🎯 HÀM XỬ LÝ KHI NGƯỜI DÙNG NHẬP GIÁ TAY
    const handlePriceInputChange = (e) => {
        const value = Number(e.target.value);
        setPriceInput(value);
        // Nếu người dùng nhập mức trần thấp hơn giá trị thanh kéo hiện tại, ép thanh kéo co về bằng mức trần luôn
        if (priceRange > value) {
            setPriceRange(value);
        }
    };

    const handleSelectCategory = (e, cId) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCategoryId(cId);
        setActiveAccordionId(activeAccordionId === cId ? null : cId);
    };

    return (
        <div className="w-100">

            {/* KHỐI 1: TÌM KIẾM LAPTOP */}
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-3" style={{ borderRadius: '12px' }}>
                <div className="card-body p-3">
                    <label className="font-weight-bold text-secondary small text-uppercase mb-2">
                        <i className="bi bi-laptop mr-2 text-primary"></i> Tìm kiếm Laptop
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control form-control-sm border-right-0"
                            placeholder="Nhập tên laptop, ASUS, MacBook, Dell..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ borderRadius: '6px 0 0 6px', fontSize: '0.88rem' }}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text bg-white border-left-0 text-muted" style={{ borderRadius: '0 6px 6px 0' }}>
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🚀 KHỐI 2: BỘ LỌC GIÁ KÉP THÔNG MINH (NHẬP TAY + THANH KÉO CO GIÃN) */}
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-3" style={{ borderRadius: '12px' }}>
                <div className="card-body p-3">
                    <label className="font-weight-bold text-secondary small text-uppercase mb-2">
                        <i className="bi bi-cash-coin mr-2 text-success"></i> Lọc theo giá máy
                    </label>

                    {/* Ô nhập mức giá trần tối đa */}
                    <div className="form-group mb-3">
                        <small className="text-muted d-block mb-1">Thiết lập mức giá trần tối đa (VND):</small>
                        <input
                            type="number"
                            className="form-control form-control-sm font-weight-bold text-dark"
                            value={priceInput}
                            min="0"
                            step="500000"
                            onChange={handlePriceInputChange}
                            style={{ borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Thanh kéo có max chạy động theo ô nhập */}
                    <div className="pt-2 border-top border-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Kéo chọn khoảng giá:</small>
                            <span className="text-danger font-weight-bold small" style={{ fontSize: '0.85rem' }}>
                                ≤ {priceRange.toLocaleString('vi-VN')} đ
                            </span>
                        </div>
                        <input
                            type="range"
                            className="custom-range"
                            min="0"
                            max={priceInput} // 🎯 THANH KÉO GIỚI HẠN TRONG GIÁ NGƯỜI DÙNG NHẬP
                            step="500000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                        />
                        <div className="d-flex justify-content-between text-muted" style={{ fontSize: '10px' }}>
                            <span>0đ</span>
                            <span>{priceInput.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KHỐI 3: MENU THƯƠNG HIỆU ACCORDION */}
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-dark text-white pt-3 pb-3 px-4 border-0">
                    <h5 className="card-title text-uppercase font-weight-bold mb-0" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                        <i className="bi bi-cpu mr-2 text-warning"></i> Danh mục thương hiệu
                    </h5>
                </div>

                <div className="card-body p-2">
                    <div className="list-group list-group-flush border-0">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategoryId(null);
                                setActiveAccordionId(null);
                            }}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-2.5 border-0 rounded mb-1 font-weight-bold ${selectedCategoryId === null ? 'bg-primary text-white' : 'text-secondary'}`}
                            style={{ transition: 'all 0.2s ease', fontSize: '0.88rem' }}
                        >
                            <span><i className="bi bi-grid-3x3-gap mr-2"></i> Tất cả thiết bị</span>
                        </button>

                        {loading ? (
                            <div className="p-4 text-center text-muted small">
                                <span className="spinner-border spinner-border-sm mr-2"></span>Đang dựng bộ khung...
                            </div>
                        ) : (
                            categoryProducts.map((item) => {
                                const cId = item.categoryProductId ?? item.CategoryProductId ?? item.categoryId ?? item.CategoryId ?? item.id ?? item.Id;
                                const name = item.name || item.Name;

                                const isCurrentCategory = selectedCategoryId?.toString() === cId?.toString();
                                const isExpanded = activeAccordionId?.toString() === cId?.toString();

                                const childProducts = allProducts.filter(p => {
                                    if (!p) return false;
                                    const pCatId = p.categoryProductId ?? p.CategoryProductId ?? p.categoryId ?? p.CategoryId;
                                    return pCatId?.toString() === cId?.toString();
                                });

                                return (
                                    <div key={cId} className="w-100 mb-1">
                                        <button
                                            type="button"
                                            onClick={(e) => handleSelectCategory(e, cId)}
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-2.5 border-0 rounded ${isCurrentCategory ? 'bg-primary text-white font-weight-bold' : 'text-dark font-weight-bold'}`}
                                            style={{ transition: 'all 0.2s ease', fontSize: '0.88rem', backgroundColor: isCurrentCategory ? '' : '#f8f9fa' }}
                                        >
                                            <span><i className="bi bi-hdd-network mr-2 text-info"></i> {name}</span>
                                            <i className="bi bi-chevron-down small" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', opacity: 0.7 }}></i>
                                        </button>

                                        <div className="overflow-hidden" style={{ maxHeight: isExpanded ? `${childProducts.length * 45 + 15}px` : '0px', transition: 'max-height 0.25s ease-in-out', backgroundColor: '#fdfdfd' }}>
                                            <div className="pl-4 pr-2 py-1 border-left ml-4 border-light">
                                                {childProducts.length === 0 ? (
                                                    <div className="text-muted small py-2 pl-3 italic">Chưa có dòng máy...</div>
                                                ) : (
                                                    childProducts.map(prod => (
                                                        <a key={prod.id || prod.Id} href={`/product/${prod.id || prod.Id}`} className="d-block text-secondary text-decoration-none small py-2 pl-3 rounded-sm text-truncate hover-sub-item">
                                                            <i className="bi bi-dot mr-1"></i> {prod.name}
                                                        </a>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSidebar;