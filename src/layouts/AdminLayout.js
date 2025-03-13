// layouts/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaShoppingCart, FaBars, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <FaTachometerAlt className="w-5 h-5" />
    },
    {
      path: '/admin/products',
      name: 'Quản lý sản phẩm',
      icon: <FaBox className="w-5 h-5" />
    },
    {
      path: '/admin/users',
      name: 'Quản lý người dùng',
      icon: <FaUsers className="w-5 h-5" />
    },
    {
      path: '/admin/orders',
      name: 'Quản lý đơn hàng',
      icon: <FaShoppingCart className="w-5 h-5" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-800 transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:static md:inset-0`}
      >
        <div className="flex items-center justify-center h-16 bg-indigo-900">
          <span className="text-white text-xl font-bold">Admin Dashboard</span>
        </div>
        <div className="px-2 py-4">
          <div className="flex flex-col items-center p-4 mb-6 border-b border-indigo-700">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="mt-2 text-center">
              <div className="text-white font-medium">{user?.username || 'Admin'}</div>
              <div className="text-indigo-300 text-xs">{user?.email || 'admin@example.com'}</div>
            </div>
          </div>
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-white rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-900'
                    : 'hover:bg-indigo-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            <Link
              to="/"
              className="flex items-center px-4 py-3 mt-6 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaHome className="w-5 h-5" />
              <span className="ml-3">Về trang chủ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mt-2 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="ml-3">Đăng xuất</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium text-gray-700">
                    {user?.username || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;