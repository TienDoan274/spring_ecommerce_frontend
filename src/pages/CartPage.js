// pages/CartPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { productService } from '../services/productService';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // This would be an API call in a real application
        // const response = await productService.getCartItems();
        // setCartItems(response);
        
        // For demo, we'll use mock data
        setTimeout(() => {
          const mockCartItems = [
            {
              id: 1,
              productId: '67cff271b6dd012f66cbba01',
              name: 'OPPO Find N3 Flip 5G 12GB/256GB Đen/Vàng đồng',
              color: 'Đen',
              price: 16990000,
              quantity: 1,
              image: 'https://cdn.tgdd.vn/Products/Images/42/309835/oppo-n3-flip-den-glr-1-180x125.jpg'
            },
            {
              id: 2,
              productId: '67cff271b6dd012f66cbb9fe',
              name: 'OPPO A38 6GB/128GB',
              color: 'Xanh',
              price: 4490000,
              quantity: 2,
              image: 'https://cdn.tgdd.vn/Products/Images/42/320836/TimerThumb/oppo-a38-6gb-(24).jpg'
            }
          ];
          setCartItems(mockCartItems);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
    
    // In a real app, you would call an API to update the cart
    // productService.updateCartItem(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    // In a real app, you would call an API to remove the item
    // productService.removeCartItem(id);
  };

  // Calculate total
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
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
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <FaShoppingCart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <Link
            to="/products/phone"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  {cartItems.length} sản phẩm
                </span>
                <button
                  onClick={() => setCartItems([])}
                  className="text-gray-500 hover:text-red-500 text-sm flex items-center"
                >
                  <FaTrash className="mr-1" />
                  Xóa tất cả
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                  <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="sm:ml-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <Link 
                          to={`/product/${item.productId}`}
                          className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                        {item.color && (
                          <p className="mt-1 text-sm text-gray-500">
                            Màu: {item.color}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0 text-lg font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-l"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                          className="w-12 text-center border-t border-b border-gray-300"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-r"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                          Tổng: {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              to="/products/phone" 
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <FaArrowLeft className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-900 font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-900 font-medium">Miễn phí</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-6">
              <div className="flex justify-between mb-6">
                <span className="text-lg font-medium text-gray-900">Tổng cộng</span>
                <span className="text-xl font-bold text-indigo-600">{formatPrice(calculateSubtotal())}</span>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Tiến hành thanh toán
              </Link>
            </div>
            
            {/* Coupon Code */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Mã giảm giá</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-200 font-medium"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;