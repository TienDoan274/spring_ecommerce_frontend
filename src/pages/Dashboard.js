// pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, hasRole, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate is handled by AuthContext useEffect
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">MyApp</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/profile"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Hồ sơ
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Quản trị
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Xin chào, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Role-based content */}
            {isAuthenticated ? (
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Chào mừng, {user?.username}!
                  </h2>
                  <p className="text-gray-600 mt-1">Vai trò: {user?.roles?.join(', ')}</p>
                </div>

                {/* Admin specific content */}
                {isAdmin() && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-lg font-medium text-indigo-800 mb-2">Quản trị hệ thống</h3>
                    <p className="text-indigo-600 mb-4">
                      Là quản trị viên, bạn có thể quản lý người dùng và cấu hình hệ thống.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Quản lý người dùng</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Thêm, sửa, xóa và phân quyền người dùng trong hệ thống.
                        </p>
                        <Link
                          to="/admin/users"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Truy cập
                        </Link>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Cài đặt hệ thống</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Cấu hình và tùy chỉnh các thiết lập hệ thống.
                        </p>
                        <Link
                          to="/admin/settings"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Truy cập
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manager specific content */}
                {hasRole('MANAGER') && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">Quản lý</h3>
                    <p className="text-yellow-600 mb-4">
                      Là quản lý, bạn có thể xem báo cáo và quản lý nội dung hệ thống.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Báo cáo</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Xem thống kê và báo cáo hoạt động.
                        </p>
                        <Link
                          to="/manager/reports"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Xem báo cáo
                        </Link>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Quản lý nội dung</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Quản lý và phê duyệt nội dung trên hệ thống.
                        </p>
                        <Link
                          to="/manager/content"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Quản lý
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular user content */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Thông tin cá nhân</h3>
                  <p className="text-gray-600 mb-4">
                    Xem và cập nhật thông tin tài khoản của bạn.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Hồ sơ cá nhân</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Cập nhật thông tin cá nhân và thay đổi mật khẩu.
                      </p>
                      <Link
                        to="/profile"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                      >
                        Xem hồ sơ
                      </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Hoạt động gần đây</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Xem lịch sử hoạt động trên hệ thống.
                      </p>
                      <Link
                        to="/activities"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                      >
                        Xem hoạt động
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Chào mừng đến với ứng dụng của chúng tôi</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Đăng nhập để trải nghiệm đầy đủ các tính năng của hệ thống. Nếu bạn chưa có tài khoản, vui lòng đăng ký để tiếp tục.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;