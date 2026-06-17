/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Chức năng: Component Cha điều phối bộ lọc nâng cao (Danh mục, Tìm kiếm, Nhập giá trần & Kéo lọc giá)
 *            [CẬP NHẬT] Nhận selectedCategoryId từ trang chủ qua useLocation().state để lọc ngay lập tức
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShopSidebar from './ShopSidebar';
import ProductList from './ProductList';

const Shop = () => {
    const location = useLocation();

    // Khởi tạo selectedCategoryId từ state điều hướng (trang chủ truyền vào)
    // Nếu không có state → mặc định null (Tất cả sản phẩm)
    const [selectedCategoryId, setSelectedCategoryId] = useState(
        location.state?.selectedCategoryId ?? null
    );
    const [searchTerm, setSearchTerm] = useState('');

    // 🎯 Bộ đôi lọc giá: Mặc định kho máy tối đa 50 triệu VNĐ
    const [priceInput, setPriceInput] = useState(50000000);
    const [priceRange, setPriceRange] = useState(50000000);

    // Cập nhật lại filter khi navigate từ trang chủ bấm danh mục khác nhau
    useEffect(() => {
        if (location.state?.selectedCategoryId !== undefined) {
            setSelectedCategoryId(location.state.selectedCategoryId);
        }
    }, [location.state]);

    return (
        <div className="container-fluid p-0">
            <div className="row mt-3">

                {/* CỘT TRÁI (BỀ RỘNG 4): THANH BỘ LỌC TỔNG HỢP */}
                <div className="col-md-4 mb-4">
                    <ShopSidebar
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        priceInput={priceInput}
                        setPriceInput={setPriceInput}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />
                </div>

                {/* CỘT PHẢI (BỀ RỘNG 8): LƯỚI SẢN PHẨM REAL-TIME */}
                <div className="col-md-8">
                    <ProductList
                        selectedCategoryId={selectedCategoryId}
                        searchTerm={searchTerm}
                        priceRange={priceRange}
                    />
                </div>

            </div>
        </div>
    );
};

export default Shop;