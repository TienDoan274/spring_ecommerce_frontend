// components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaShoppingCart, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { AiOutlineDown } from 'react-icons/ai';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  // Định nghĩa các đường dẫn để đảm bảo nhất quán
  const productLinks = [
    { path: '/products/phone?page=0', label: 'Điện thoại' },
    { path: '/products/laptop?page=0', label: 'Laptop' }
  ];

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl">TechStore</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-white hover:bg-indigo-500 rounded-md">
                Trang chủ
              </Link>
              {productLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.path} 
                  className="px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 justify-center px-4">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="absolute right-0 top-0 mt-2.5 mr-4 text-gray-500">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Menu */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <>
                {/* Cart Icon - Only for users */}
                {!isAdmin() && (
                  <Link to="/cart" className="text-white p-2 rounded-full hover:bg-indigo-500">
                    <FaShoppingCart className="h-6 w-6" />
                  </Link>
                )}
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center text-white p-2 rounded-full hover:bg-indigo-500 focus:outline-none"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <span className="mr-2">{user.username}</span>
                    <AiOutlineDown />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Hồ sơ
                        </Link>
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Quản trị
                          </Link>
                        )}
                        {!isAdmin() && (
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Đơn hàng
                          </Link>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white px-3 py-2 rounded-md hover:bg-indigo-500"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-indigo-700 px-3 py-2 rounded-md hover:bg-indigo-800"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-white hover:bg-indigo-500 p-2 rounded-md focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            
            {/* Sử dụng cùng danh sách đường link với desktop */}
            {productLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 text-gray-500">
                  <FaSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
            
            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-indigo-700">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.username}</div>
                    <div className="text-sm font-medium text-indigo-300">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  {!isAdmin() && (
                    <>
                      <Link
                        to="/cart"
                        className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Giỏ hàng
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đơn hàng
                      </Link>
                    </>
                  )}
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    className="block w-full text-left px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-indigo-700 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-white hover:bg-indigo-500 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;