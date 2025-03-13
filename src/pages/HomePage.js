// pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import { FaPhone, FaLaptop, FaHeadphones, FaTabletAlt, FaShoppingCart, FaBolt } from 'react-icons/fa';

const HomePage = () => {
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [featuredLaptops, setFeaturedLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        // Fetch phones and laptops
        const [phonesResponse, laptopsResponse] = await Promise.all([
          productService.getProductsByType('PHONE', 0, 4),
          productService.getProductsByType('LAPTOP', 0, 4)
        ]);
        
        setFeaturedPhones(phonesResponse.content || []);
        setFeaturedLaptops(laptopsResponse.content || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Hero banner carousel - in a real app you would use a carousel library
  const heroBanners = [
    {
      id: 1,
      title: 'iPhone 15 Series',
      description: 'Trải nghiệm đỉnh cao với camera chất lượng cao và hiệu năng mạnh mẽ.',
      image: 'https://cdn.tgdd.vn/2023/09/banner/iPhone-15-2880-x-1000-2880x1000.png',
      link: '/products/phone'
    }
  ];

  // Categories
  const categories = [
    {
      id: 'phone',
      name: 'Điện thoại',
      icon: <FaPhone className="w-6 h-6" />,
      link: '/products/phone'
    },
    {
      id: 'laptop',
      name: 'Laptop',
      icon: <FaLaptop className="w-6 h-6" />,
      link: '/products/laptop'
    },
    {
      id: 'tablet',
      name: 'Máy tính bảng',
      icon: <FaTabletAlt className="w-6 h-6" />,
      link: '#'
    },
    {
      id: 'accessories',
      name: 'Phụ kiện',
      icon: <FaHeadphones className="w-6 h-6" />,
      link: '#'
    }
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gray-900">
        {heroBanners.map((banner) => (
          <div key={banner.id} className="relative">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {banner.title}
                  </h1>
                  <p className="text-white text-lg mb-6">{banner.description}</p>
                  <Link
                    to={banner.link}
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Khám phá ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className="bg-red-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <FaBolt className="text-red-600 w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Flash Sale</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredPhones.slice(0, 4).map((product) => (
                <div
                  key={product.groupDto.groupId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${product.products[0].productId}`}>
                    <div className="relative">
                      <img
                        src={product.groupDto.image || 'https://via.placeholder.com/300'}
                        alt={product.products[0].productName}
                        className="w-full h-48 object-contain p-4"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.products[0].productName}
                      </h3>
                      <div className="mt-2 flex flex-col">
                        <span className="text-indigo-600 font-bold">
                          {product.products[0].defaultCurrentPrice}
                        </span>
                        {product.products[0].defaultOriginalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            {product.products[0].defaultOriginalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/products/phone"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Phones */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Điện thoại nổi bật</h2>
          <Link
            to="/products/phone"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Xem tất cả
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ProductGrid products={featuredPhones} loading={false} error={error} />
        )}
      </div>

      {/* Featured Laptops */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Laptop nổi bật</h2>
          <Link
            to="/products/laptop"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Xem tất cả
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ProductGrid products={featuredLaptops} loading={false} error={error} />
        )}
      </div>

      {/* Banner */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-indigo-600 rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Mua sắm ngay hôm nay
                </h2>
                <p className="text-indigo-100 mb-6">
                  Khám phá các sản phẩm chất lượng cao với giá cả cạnh tranh. Giao hàng miễn phí cho đơn hàng trên 500.000đ.
                </p>
                <div>
                  <Link
                    to="/products/phone"
                    className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors"
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Mua sắm ngay
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://cdn.tgdd.vn/mwgcart/mwgcore/ContentMwg/images/homev2/desk/tgdd@2x.png"
                  alt="Shopping Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;