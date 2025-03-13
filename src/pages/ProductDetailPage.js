// pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaArrowLeft, FaCheck, FaStar, FaHeart } from 'react-icons/fa';
import placeholder from '../assets/placeholder-image.png'; // Make sure to add a placeholder image

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [variantProducts, setVariantProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageUrls, setSelectedImageUrls] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        // Fetch product details
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        
        // Set initial selected color
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
          
          // Set initial images based on the first color
          if (productData.images && productData.images[productData.colors[0]]) {
            const imageUrls = productData.images[productData.colors[0]].map(img => img.url);
            setSelectedImageUrls(imageUrls);
          }
        }
        
        // Fetch variant products
        const variantsData = await productService.getProductVariants(productId);
        setVariantProducts(variantsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  // Handle color selection
  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (product.images && product.images[color]) {
      const imageUrls = product.images[color].map(img => img.url);
      setSelectedImageUrls(imageUrls);
      setCurrentImageIndex(0); // Reset to first image when color changes
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    
    // Add to cart logic would go here
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  // Get current price and original price based on selected color
  const getCurrentPrice = () => {
    if (!product) return null;
    
    const colorIndex = product.colors.indexOf(selectedColor);
    if (colorIndex >= 0 && product.current_prices && product.current_prices[colorIndex]) {
      return product.current_prices[colorIndex];
    }
    
    return product.current_prices && product.current_prices[0] ? product.current_prices[0] : null;
  };
  
  const getOriginalPrice = () => {
    if (!product) return null;
    
    const colorIndex = product.colors.indexOf(selectedColor);
    if (colorIndex >= 0 && product.original_prices && product.original_prices[colorIndex]) {
      return product.original_prices[colorIndex];
    }
    
    return product.original_prices && product.original_prices[0] ? product.original_prices[0] : null;
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    const originalPrice = getOriginalPrice();
    const currentPrice = getCurrentPrice();
    
    if (!originalPrice || !currentPrice) return 0;
    
    const originalPriceValue = productService.formatPrice(originalPrice);
    const currentPriceValue = productService.formatPrice(currentPrice);
    
    if (!originalPriceValue || !currentPriceValue || originalPriceValue <= currentPriceValue) return 0;
    
    return Math.round(((originalPriceValue - currentPriceValue) / originalPriceValue) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Link to="/products/phone" className="text-indigo-600 hover:underline mt-2 inline-block">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Không tìm thấy sản phẩm.</p>
          <Link to="/products/phone" className="text-indigo-600 hover:underline mt-2 inline-block">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-indigo-600">
              Trang chủ
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link to={`/products/${product.type.toLowerCase()}`} className="text-gray-500 hover:text-indigo-600">
              {product.type === 'PHONE' ? 'Điện thoại' : 'Laptop'}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700 font-medium truncate">{product.productName}</li>
        </ol>
      </nav>

      {/* Back button - Mobile only */}
      <div className="md:hidden mb-4">
        <Link
          to={`/products/${product.type.toLowerCase()}`}
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <FaArrowLeft className="mr-1" /> Quay lại
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Product Images */}
          <div className="md:w-2/5 mb-8 md:mb-0">
            <div className="relative mb-4">
              <img
                src={selectedImageUrls[currentImageIndex] || placeholder}
                alt={product.productName}
                className="w-full h-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholder;
                }}
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {selectedImageUrls.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {selectedImageUrls.slice(0, 5).map((image, index) => (
                  <div
                    key={index}
                    className={`border rounded cursor-pointer hover:border-indigo-500 ${
                      currentImageIndex === index ? 'border-indigo-500 border-2' : 'border-gray-300'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.productName} - ảnh ${index + 1}`}
                      className="w-full h-16 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholder;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.productName}</h1>
            
            {/* Brand */}
            <div className="mb-4">
              <span className="text-gray-600">Thương hiệu: </span>
              <span className="font-medium">{product.brand}</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {getOriginalPrice() && (
                <span className="text-gray-500 line-through text-lg mr-2">
                  {getOriginalPrice()}
                </span>
              )}
              <span className="text-2xl font-bold text-indigo-600">
                {getCurrentPrice() || "Liên hệ"}
              </span>
              
              {/* Stock status */}
              {product.quantities && product.quantities.some(qty => qty > 0) ? (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCheck className="mr-1" /> Còn hàng
                </span>
              ) : (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Hết hàng
                </span>
              )}
            </div>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        selectedColor === color
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => handleColorChange(color)}
                      disabled={product.quantities && product.quantities[index] <= 0}
                    >
                      {color}
                      {product.quantities && product.quantities[index] <= 0 && ' (Hết hàng)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Variant Products */}
            {variantProducts && variantProducts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Phiên bản khác</h3>
                <div className="flex flex-wrap gap-2">
                  {variantProducts.map((variant) => (
                    <Link
                      key={variant.productId}
                      to={`/product/${variant.productId}`}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        variant.productId === productId
                          ? 'bg-indigo-600 text-white cursor-default'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {variant.variant}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Số lượng</h3>
              <div className="flex">
                <button
                  type="button"
                  className="border border-gray-300 px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border-t border-b border-gray-300 text-center w-16 px-3 py-1"
                />
                <button
                  type="button"
                  className="border border-gray-300 px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                type="button"
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={!isAuthenticated}
              >
                <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center"
              >
                <FaHeart className="mr-2" /> Thêm vào yêu thích
              </button>
            </div>
            
            {/* Promotions */}
            {product.promotions && product.promotions.length > 0 && (
              <div className="mb-6 bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Ưu đãi & Khuyến mãi</h3>
                <ul className="space-y-2">
                  {product.promotions.slice(0, 4).map((promo, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-5 h-5 bg-blue-500 text-white rounded-full flex-shrink-0 mr-2 text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm text-blue-800">{promo}</span>
                    </li>
                  ))}
                  {product.promotions.length > 4 && (
                    <li className="text-sm text-blue-600 font-medium">
                      + {product.promotions.length - 4} ưu đãi khác
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {/* Short Specifications */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.specifications && product.specifications.slice(0, 8).map((spec, index) => (
                  <div key={index} className="flex">
                    <span className="text-sm text-gray-500 min-w-36">{spec.name}:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}
                    </span>
                  </div>
                ))}
              </div>
              {product.specifications && product.specifications.length > 8 && (
                <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Xem thêm thông số
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả sản phẩm</h2>
        
        {/* Product Reviews as Description */}
        <div className="space-y-6">
          {product.productReviews && product.productReviews.map((review, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{review.title}</h3>
              <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Specifications */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông số kỹ thuật chi tiết</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {product.specifications && product.specifications.map((spec, index) => (
            <div key={index} className={`flex p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className="text-gray-600 font-medium w-1/3">{spec.name}:</span>
              <div className="w-2/3">
                {Array.isArray(spec.value) ? (
                  <ul className="list-disc pl-5">
                    {spec.value.map((val, idx) => (
                      <li key={idx} className="text-gray-800">{val}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-800">{spec.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;