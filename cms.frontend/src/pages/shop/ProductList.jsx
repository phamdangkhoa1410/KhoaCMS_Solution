/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Vị trí file: src/pages/shop/ProductList.jsx
 * Chức năng: Đã bổ sung tầng lọc giá (nhỏ hơn hoặc bằng thanh kéo) real-time mượt mà
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';

const ProductList = ({ selectedCategoryId, searchTerm, priceRange, page, setPage }) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                const params = {
                    page: page,
                    pageSize: 6, // Hiển thị 6 sản phẩm mỗi trang cho dễ thấy phân trang
                    keyword: searchTerm || "",
                    minPrice: 0,
                    maxPrice: priceRange || 999999999
                };
                if (selectedCategoryId) {
                    params.categoryId = selectedCategoryId;
                }

                const res = await productService.advancedSearch(params);
                if (res && res.data) {
                    setProducts(res.data);
                    setPagination(res.pagination || { currentPage: 1, totalPages: 1, totalItems: res.data.length });
                }
            } catch (error) {
                console.error("Lỗi fetch API Laptop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [selectedCategoryId, searchTerm, priceRange, page]); // Gọi lại API mỗi khi filter/page thay đổi

    // Reset về trang 1 khi các tham số lọc thay đổi
    useEffect(() => {
        setPage(1);
    }, [selectedCategoryId, searchTerm, priceRange, setPage]);

    if (loading) {
        return (
            <div className="text-center my-5 p-5 bg-white rounded shadow-sm">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <div className="font-weight-bold text-secondary">Đang quét kho dữ liệu Laptop từ SQL Server...</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-5 bg-white border rounded shadow-sm px-4 w-100">
                <i className="bi bi-cpu text-muted mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                <p className="text-secondary font-weight-bold mb-1">Không tìm thấy mã máy hoặc cấu hình phù hợp!</p>
                <p className="text-muted small">Khoa hãy kiểm tra lại từ khóa, đổi danh mục hoặc nới rộng khoảng giá nhập nhen.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="text-uppercase text-dark font-weight-bold mb-0" style={{ fontSize: '1.1rem' }}>
                    <i className="bi bi-display text-primary mr-2"></i> Danh sách thiết bị sẵn có ({pagination.totalItems})
                </h4>
            </div>

            <div className="row">
                {products.map((product) => {
                    const id = product.id || product.Id;
                    return (
                        <div className="col-md-6 col-lg-4 mb-4" key={id}>
                            <div className="card h-100 border-0 rounded-lg overflow-hidden shadow-sm" style={{ borderRadius: '12px' }}>
                                <div className="position-relative bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '190px' }}>
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://localhost:7243${product.imageUrl}`}
                                            alt={product.name}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'contain', padding: '10px' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=400&auto=format&fit=crop';
                                            }}
                                        />
                                    ) : (
                                        <i className="bi bi-laptop text-muted" style={{ fontSize: '3rem' }}></i>
                                    )}
                                </div>

                                <div className="card-body p-3 d-flex flex-column bg-white">
                                    <h6 className="font-weight-bold text-dark mb-1 text-truncate" style={{ fontSize: '0.92rem' }} title={product.name}>
                                        {product.name}
                                    </h6>

                                    <div className="mb-2">
                                        <span className="badge badge-soft-info text-primary bg-light font-weight-bold" style={{ fontSize: '0.75rem', padding: '3px 6px', borderRadius: '4px' }}>
                                            {product.categoryProductName || product.CategoryProductName || 'Laptop'}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto mb-3 pt-2 border-top border-light">
                                        <span className="text-danger font-weight-bold" style={{ fontSize: '1rem' }}>
                                            {product.price?.toLocaleString('vi-VN')} đ
                                        </span>
                                        <span className="small text-secondary bg-light border px-2 py-0.5 rounded" style={{ fontSize: '0.72rem' }}>
                                            Sẵn: {product.stockQuantity ?? 0} máy
                                        </span>
                                    </div>

                                    <div>
                                        <Link to={`/product/${id}`} className="btn btn-primary btn-block btn-sm font-weight-bold rounded-lg py-2 text-uppercase shadow-sm" style={{ fontSize: '0.8rem', borderRadius: '6px' }}>
                                            <i className="bi bi-cpu mr-1.5"></i> Cấu hình chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PHÂN TRANG (PAGINATION UI) */}
            {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}>
                                    <i className="bi bi-chevron-left"></i> Trước
                                </button>
                            </li>
                            
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}

                            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}>
                                    Sau <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ProductList;