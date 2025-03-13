  // Navbar.js
  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import axiosInstance from '../utils/axiosConfig';
  import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Heart } from 'lucide-react';
  import './Navbar.css';

  const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Fetch cart count when user is logged in
    useEffect(() => {
      if (user) {
        fetchCartCount();
      }
    }, [user]);

    const fetchCartCount = async () => {
      try {
        const response = await axiosInstance.get('/cart/count');
        setCartCount(response.data);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserDropdown = () => {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">ElectroShop</Link>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          {/* Navigation links */}
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <div className="navbar-categories">
              <div className="dropdown">
                <button className="dropbtn">
                  Điện thoại <ChevronDown size={16} />
                </button>
                <div className="dropdown-content">
                  <Link to="/products/phone">Tất cả điện thoại</Link>
                  <Link to="/products/phone/apple">Apple</Link>
                  <Link to="/products/phone/samsung">Samsung</Link>
                  <Link to="/products/phone/xiaomi">Xiaomi</Link>
                  <Link to="/products/phone/oppo">Oppo</Link>
                </div>
              </div>

              <div className="dropdown">
                <button className="dropbtn">
                  Laptop <ChevronDown size={16} />
                </button>
                <div className="dropdown-content">
                  <Link to="/products/laptop">Tất cả laptop</Link>
                  <Link to="/products/laptop/macbook">MacBook</Link>
                  <Link to="/products/laptop/dell">Dell</Link>
                  <Link to="/products/laptop/hp">HP</Link>
                  <Link to="/products/laptop/asus">Asus</Link>
                </div>
              </div>
            </div>

            <div className="navbar-auth">
              {user ? (
                <>
                  <div className="dropdown">
                    <button className="dropbtn user-btn" onClick={toggleUserDropdown}>
                      <User size={20} />
                      <span>{user.username}</span>
                      <ChevronDown size={16} />
                    </button>
                    <div className={`dropdown-content ${isUserDropdownOpen ? 'show' : ''}`}>
                      <Link to="/profile">Tài khoản của tôi</Link>
                      <Link to="/orders">Đơn hàng</Link>
                      <Link to="/wishlist">
                        <div className="dropdown-item-with-icon">
                          <Heart size={16} />
                          <span>Yêu thích</span>
                        </div>
                      </Link>
                      <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>

                  <Link to="/cart" className="cart-icon">
                    <div className="cart-container">
                      <ShoppingCart size={20} />
                      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="login-btn">Đăng nhập</Link>
                  <Link to="/register" className="register-btn">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;