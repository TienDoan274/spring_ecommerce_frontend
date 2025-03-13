// components/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import placeholderImage from '../assets/placeholder-image.png';

const ProductCard = ({ product }) => {
  // Hook phải được gọi ở đầu component, trước bất kỳ điều kiện nào
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!product) {
    console.error('ProductCard received undefined product');
    return null;
  }

  // Kiểm tra cấu trúc dữ liệu
  const { groupDto, products } = product;
  
  if (!products || products.length === 0) {
    console.error('ProductCard: Không có thông tin sản phẩm');
    return null;
  }
  
  // Lấy sản phẩm đại diện (orderNumber = 1 hoặc sản phẩm đầu tiên)
  const defaultProduct = products.find(p => p.orderNumber === 1) || products[0];
  
  // Dùng selectedProduct nếu có, nếu không dùng defaultProduct
  const currentProduct = selectedProduct || defaultProduct;
  
  // Cập nhật selectedProduct nếu nó là null
  if (selectedProduct === null && defaultProduct) {
    setSelectedProduct(defaultProduct);
  }
  
  // Lấy ID nhóm sản phẩm
  const groupId = groupDto?.groupId || 'unknown-id';
  
  // Lấy tên sản phẩm từ sản phẩm được chọn
  const productName = currentProduct?.productName || 'Sản phẩm không tên';
  
  // Xử lý giá (chuỗi đã được định dạng)
  const currentPriceFormatted = currentProduct?.defaultCurrentPrice || '';
  const originalPriceFormatted = currentProduct?.defaultOriginalPrice || '';
  
  // Kiểm tra xem cả hai giá đều không phải null
  const showBothPrices = originalPriceFormatted && currentPriceFormatted;
  
  // Chuyển đổi giá từ chuỗi định dạng sang số để so sánh
  const convertPriceToNumber = (priceString) => {
    if (!priceString) return 0;
    // Loại bỏ các ký tự không phải số
    return parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;
  };
  
  const currentPrice = convertPriceToNumber(currentPriceFormatted);
  const originalPrice = convertPriceToNumber(originalPriceFormatted);
  
  // Lấy URL hình ảnh
  const imageUrl = groupDto?.image || placeholderImage;
  
  // Kiểm tra xem sản phẩm có đang giảm giá không
  const hasDiscount = originalPrice > currentPrice && currentPrice > 0 && originalPrice > 0;
  
  // Tính phần trăm giảm giá nếu có
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;
    
  // Đếm số lượng biến thể
  const variantCount = products.length;
  
  // Xử lý khi chọn variant
  const handleVariantClick = (e, product) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng Link
    setSelectedProduct(product);
  };
  
  // Rút gọn tên biến thể nếu quá dài
  const truncateVariant = (variant, maxLength = 10) => {
    if (!variant) return 'Mặc định';
    return variant.length > maxLength ? `${variant.slice(0, maxLength)}...` : variant;
  };

  return (
    <Link 
      to={`/products/${groupId}`} 
      className="bg-white rounded-lg shadow-md transition-transform hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Ảnh sản phẩm */}
      <div className="relative pt-[100%] overflow-hidden rounded-t-lg">
        <img 
          src={imageUrl} 
          alt={productName}
          className="absolute top-0 left-0 w-full h-full object-contain p-4" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />
        
        {/* Badge giảm giá */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-1">
        {/* Tên sản phẩm */}
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{productName}</h3>
        
        {/* Hiển thị các biến thể có thể chọn */}
        {variantCount > 1 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {products.map((p) => (
              <button
                key={p.productId}
                onClick={(e) => handleVariantClick(e, p)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  currentProduct.productId === p.productId
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {truncateVariant(p.variant)}
              </button>
            ))}
          </div>
        )}
        
        {/* Giá */}
        <div className="mt-auto">
          {currentPriceFormatted ? (
            <>
              {showBothPrices ? (
                <>
                  <span className={`font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                    {currentPriceFormatted}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-500 text-sm line-through ml-2">
                      {originalPriceFormatted}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-900 font-bold">{currentPriceFormatted}</span>
              )}
            </>
          ) : (
            <span className="text-gray-500 italic">Liên hệ</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;