// pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
        <p className="text-lg text-gray-700 mb-6">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn tin rằng đây là lỗi.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;