/*
 * Sinh viên: Phạm Đăng Khoa
 * Mã Sinh Viên : 2123110058
 * Lớp: CCQ2311B - Trường Cao Đẳng Công Thương TP.HCM
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import productService from '../../services/productService';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // ================= STATE =================
    const [cartCount, setCartCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Live Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // ================= EFFECTS =================
    
    // Đóng Dropdown User & Search khi click ra ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Load số lượng giỏ hàng từ DB
    useEffect(() => {
        const updateCartCount = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setCartCount(0);
                    return;
                }
                const user = JSON.parse(userStr);
                const customerId = user.id || user.Id;
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Cart/${customerId}`);
                if (response.ok) {
                    const cart = await response.json();
                    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    setCartCount(total);
                } else {
                    setCartCount(0);
                }
            } catch { setCartCount(0); }
        };
        updateCartCount(); // Chạy lần đầu khi mount
        window.addEventListener('cartUpdate', updateCartCount); // Nghe sự kiện khi bấm thêm ở trang khác
        return () => window.removeEventListener('cartUpdate', updateCartCount);
    }, [location]);

    // Fetch dữ liệu thật từ API qua productService để đồng bộ với Shop
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const resProducts = await productService.getAllProducts();
                let data = [];
                // Bóc tách mảng data giống y hệt như trang Shop
                if (Array.isArray(resProducts)) {
                    data = resProducts;
                } else if (resProducts && Array.isArray(resProducts.data)) {
                    data = resProducts.data;
                } else if (resProducts && resProducts.data && Array.isArray(resProducts.data.data)) {
                    data = resProducts.data.data;
                }
                setAllProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm cho Live Search:", error);
            }
        };
        fetchProducts();
    }, []);

    // Xử lý khi gõ tìm kiếm
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        const searchKey = query.trim().toLowerCase();
        
        if (searchKey === '') {
            setFilteredProducts([]);
            setIsSearchOpen(false);
        } else {
            // Lọc an toàn cả thuộc tính Name viết hoa và name viết thường
            const results = allProducts.filter(p => {
                const productName = (p.Name || p.name || '').toLowerCase();
                return productName.includes(searchKey);
            });
            setFilteredProducts(results);
            setIsSearchOpen(true);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            setIsSearchOpen(false);
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Hàm format tiền
    const formatPrice = (product) => {
        const price = product.Price || product.price;
        if (price) {
            return price.toLocaleString('vi-VN') + ' Đ';
        }
        return 'Liên hệ';
    };

    // Hàm lấy ảnh chuẩn hóa
    const getImageUrl = (product) => {
        const img = product.ImageUrl || product.imageUrl;
        if (!img) return 'https://via.placeholder.com/50';
        return img.startsWith('http') ? img : `https://localhost:7243${img}`;
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="glass-header-container">
            
            {/* ================= TẦNG TRÊN (TOP TIER) ================= */}
            <div className="top-tier">
                
                {/* ---------- BÊN TRÁI: LOGO ---------- */}
                <div>
                    <Link to="/" className="logo-block">
                        <i className="bi bi-laptop logo-icon-svg"></i>
                        <div className="logo-text-wrapper">
                            <span className="logo-text-top">LAPTOP</span>
                            <span className="logo-text-bottom">ĐĂNG KHOA</span>
                        </div>
                    </Link>
                </div>

                {/* ---------- CHÍNH GIỮA: THANH TÌM KIẾM LIVE SEARCH ---------- */}
                <div className="search-center-wrapper d-none d-md-block" ref={searchRef}>
                    <form className="glass-search-input-group" onSubmit={handleSearchSubmit}>
                        <input 
                            className="form-control glass-search-input" 
                            type="search" 
                            placeholder="Bạn cần tìm siêu phẩm nào hôm nay?" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                        />
                        <button className="glass-search-btn" type="submit">
                            <i className="bi bi-search" style={{ fontSize: '1.2rem' }}></i>
                        </button>
                    </form>

                    {/* Dropdown Kết quả Live Search */}
                    {isSearchOpen && (
                        <div className="live-search-dropdown">
                            {filteredProducts.length > 0 ? (
                                <>
                                    {filteredProducts.slice(0, 5).map(product => (
                                        <Link 
                                            key={product.id || product.Id} 
                                            to={`/product/${product.id || product.Id}`} 
                                            className="search-result-item"
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <img 
                                                src={getImageUrl(product)} 
                                                alt={product.Name || product.name} 
                                                className="search-result-img"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=400&auto=format&fit=crop';
                                                }}
                                            />
                                            <div className="search-result-info">
                                                <span className="search-result-name">{product.Name || product.name}</span>
                                                <span className="search-result-price">{formatPrice(product)}</span>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="search-result-footer">
                                        Tìm thấy {filteredProducts.length} kết quả <i className="bi bi-chevron-down ml-1"></i>
                                    </div>
                                </>
                            ) : (
                                <div className="p-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
                                    Không tìm thấy sản phẩm phù hợp.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ---------- BÊN PHẢI: USER PANEL & GIỎ HÀNG ---------- */}
                <div className="d-flex align-items-center">
                    
                    {/* User Panel */}
                    {!user ? (
                        <div className="d-flex align-items-center">
                            <Link to="/login" className="btn btn-outline-light btn-sm mr-2" style={{ borderRadius: '8px' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-sm" style={{ borderRadius: '8px', background: 'linear-gradient(90deg, #00f0ff, #71a4f0)', color: '#111', fontWeight: 'bold' }}>Đăng ký</Link>
                        </div>
                    ) : (
                        <div className="position-relative" ref={dropdownRef}>
                            <div 
                                className="user-panel-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <i className="bi bi-person-circle user-icon"></i>
                                <span className="user-greeting d-none d-lg-block">
                                    Xin chào, {user.fullName}!
                                </span>
                                <span className="user-greeting d-block d-lg-none">
                                    {user.fullName}
                                </span>
                                <i className={`bi bi-chevron-down chevron-icon`} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                            </div>

                            {/* User Dropdown */}
                            {dropdownOpen && (
                                <div className="glass-dropdown-menu">
                                    <Link to="/profile" className="glass-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-person-lines-fill mr-3 text-info"></i> Thông tin cá nhân
                                    </Link>
                                    <Link to="/my-orders" className="glass-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-bag-check-fill mr-3 text-success"></i> Đơn hàng của tôi
                                    </Link>
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }}></div>
                                    <button 
                                        className="glass-dropdown-item text-danger" 
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                            navigate('/login');
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right mr-3 text-danger"></i> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Giỏ hàng độc lập */}
                    <Link to="/cart" className="cart-btn-wrapper position-relative" title="Giỏ hàng">
                        <i className="bi bi-cart3" style={{ fontSize: '1.4rem' }}></i>
                        {cartCount > 0 && (
                            <span className="cart-badge-red">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                </div>
            </div>

            {/* ================= TẦNG DƯỚI (BOTTOM TIER) ================= */}
            <div className="bottom-tier">
                <ul className="nav-menu-flat">
                    <li>
                        <Link className={`nav-link-premium ${isActive('/') ? 'active-ai' : ''}`} to="/">TRANG CHỦ</Link>
                    </li>
                    <li>
                        <Link className={`nav-link-premium ${isActive('/products') ? 'active-ai' : ''}`} to="/products">SẢN PHẨM</Link>
                    </li>
                    <li>
                        <Link className={`nav-link-premium ${isActive('/blogs') ? 'active-ai' : ''}`} to="/blogs">BÀI VIẾT</Link>
                    </li>
                </ul>
            </div>
            
        </header>
    );
};

export default Header;