// pages/ProfilePage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaShoppingBag, FaHeart, FaAddressCard, FaKey, FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  
  // Mock orders data
  const orders = [
    {
      id: 'ORD123456',
      date: '2023-12-15',
      status: 'Đã giao hàng',
      total: 21480000,
      items: [
        {
          name: 'OPPO Find N3 Flip 5G 12GB/256GB Đen/Vàng đồng',
          quantity: 1,
          price: 16990000
        },
        {
          name: 'OPPO A38 6GB/128GB',
          quantity: 1,
          price: 4490000
        }
      ]
    },
    {
      id: 'ORD123455',
      date: '2023-11-20',
      status: 'Đã hủy',
      total: 4490000,
      items: [
        {
          name: 'OPPO A38 6GB/128GB',
          quantity: 1,
          price: 4490000
        }
      ]
    }
  ];
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    fullName: 'Nguyễn Văn A',
    email: user?.email || 'user@example.com',
    phone: '0912345678',
    address: '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh'
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Form states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUserInfo = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to update user info
    setTimeout(() => {
      setInfoMessage({
        type: 'success',
        text: 'Thông tin cá nhân đã được cập nhật thành công'
      });
      setIsEditingInfo(false);
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setInfoMessage(null);
      }, 3000);
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: 'error',
        text: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
      return;
    }
    
    // In a real app, this would be an API call to change password
    setTimeout(() => {
      setPasswordMessage({
        type: 'success',
        text: 'Mật khẩu đã được thay đổi thành công'
      });
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setPasswordMessage(null);
      }, 3000);
    }, 1000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Navigation tabs
  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: <FaUser /> },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: <FaShoppingBag /> },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> },
    { id: 'address', label: 'Địa chỉ', icon: <FaAddressCard /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <FaKey /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{user?.username || 'User'}</div>
                  <div className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="w-full flex items-center px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <span className="mr-3"><FaSignOutAlt /></span>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Personal Information */}
            {activeTab === 'info' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                  {!isEditingInfo && (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                      onClick={() => setIsEditingInfo(true)}
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
                
                {infoMessage && (
                  <div className={`p-4 mb-4 rounded-md ${
                    infoMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {infoMessage.text}
                  </div>
                )}
                
                {isEditingInfo ? (
                  <form onSubmit={handleSaveUserInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={userInfo.fullName}
                          onChange={handleUserInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={userInfo.email}
                          onChange={handleUserInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={userInfo.phone}
                          onChange={handleUserInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={userInfo.address}
                          onChange={handleUserInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => setIsEditingInfo(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Họ và tên</div>
                        <div className="font-medium">{userInfo.fullName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium">{userInfo.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
                        <div className="font-medium">{userInfo.phone}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-500 mb-1">Địa chỉ</div>
                        <div className="font-medium">{userInfo.address}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Orders */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng của tôi</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <FaShoppingBag className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có đơn hàng</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa thực hiện đơn hàng nào</p>
                    <Link
                      to="/products/phone"
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                          <div>
                            <span className="font-medium text-gray-800">{order.id}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-gray-600">{formatDate(order.date)}</span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Đã giao hàng'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Đang xử lý'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Đang giao hàng'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b last:border-0">
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  SL: {item.quantity} x {formatPrice(item.price)}
                                </div>
                              </div>
                              <div className="font-medium text-right">
                                {formatPrice(item.quantity * item.price)}
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4 text-right">
                            <div className="text-sm text-gray-500 mb-1">Tổng tiền</div>
                            <div className="text-xl font-bold text-indigo-600">
                              {formatPrice(order.total)}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Sản phẩm yêu thích</h2>
                
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <FaHeart className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm yêu thích</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
                  <Link
                    to="/products/phone"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              </div>
            )}
            
            {/* Address */}
            {activeTab === 'address' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Địa chỉ</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                    Thêm địa chỉ mới
                  </button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{userInfo.fullName}</h3>
                      <p className="text-gray-600">{userInfo.address}</p>
                      <p className="text-gray-600">{userInfo.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 text-sm">
                        Sửa
                      </button>
                      <button className="px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-50 text-sm">
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Mặc định
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Change Password */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Đổi mật khẩu</h2>
                
                {passwordMessage && (
                  <div className={`p-4 mb-4 rounded-md ${
                    passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleChangePassword} className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;