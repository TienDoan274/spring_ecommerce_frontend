// pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-6xl font-medium py-8">oops! Trang không tìm thấy</h2>
        <p className="text-2xl pb-8 px-12 font-medium">
          Trang bạn đang tìm kiếm không tồn tại. Nó có thể đã được di chuyển hoặc xóa.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="py-3 px-6 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          <Link
            to="/"
            className="py-3 px-6 text-white bg-gray-800 hover:bg-gray-900 rounded-md font-medium flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;