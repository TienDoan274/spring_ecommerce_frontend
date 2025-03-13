// src/pages/admin/AdminDashboard.js
import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tổng đơn hàng</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tổng sản phẩm</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tổng người dùng</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Đang phát triển</h2>
        <p>Chức năng bảng điều khiển cho quản trị viên đang được phát triển.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;