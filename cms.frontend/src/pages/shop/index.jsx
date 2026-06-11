/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 * Chức năng: Component Cha điều phối bộ lọc nâng cao (Danh mục, Tìm kiếm, Nhập giá trần & Kéo lọc giá)
 */

import React, { useState } from 'react';
import ShopSidebar from './ShopSidebar';
import ProductList from './ProductList';

const Shop = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 🎯 Bộ đôi lọc giá: Mặc định kho máy tối đa 50 triệu VNĐ
    const [priceInput, setPriceInput] = useState(50000000);
    const [priceRange, setPriceRange] = useState(50000000);

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
                        priceRange={priceRange} // Lưới sản phẩm sẽ lọc theo giá trị thanh kéo cuối cùng
                    />
                </div>

            </div>
        </div>
    );
};

export default Shop;