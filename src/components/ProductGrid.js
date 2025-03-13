// components/ProductGrid.js
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error }) => {
  console.log('ProductGrid received:', { 
    productsCount: products ? products.length : 0, 
    loading, 
    error 
  });

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="bg-gray-200 animate-pulse rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Hiển thị thông báo nếu không có sản phẩm
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.groupDto?.groupId || product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;