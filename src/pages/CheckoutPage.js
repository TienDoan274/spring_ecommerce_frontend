// src/pages/CheckoutPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thanh toán</h1>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">Lưu ý:</p>
        <p>Trang thanh toán đang được phát triển. Vui lòng quay lại sau.</p>
        <Link to="/cart" className="text-indigo-600 hover:underline mt-2 inline-block">
          Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;