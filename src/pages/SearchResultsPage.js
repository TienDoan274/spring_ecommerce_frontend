// pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import { FaSearch, FaFilter } from 'react-icons/fa';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const pageSize = 12;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await productService.searchProducts(query, currentPage, pageSize);
        
        // For demo, we'll use mock data
        setTimeout(() => {
          // Mock search results data (simplified version of your product data structure)
          const mockResults = {
            content: [
              {
                groupDto: {
                  groupId: 471,
                  orderNumber: 106,
                  image: "https://cdn.tgdd.vn/Products/Images/42/328399/itel-it2600-blue-thumb-1-600x600.jpg",
                  type: "PHONE"
                },
                products: [
                  {
                    productId: "67cff272b6dd012f66cbba09",
                    variant: null,
                    orderNumber: 1,
                    productName: "Điện thoại Itel it2600",
                    defaultOriginalPrice: null,
                    defaultCurrentPrice: "490.000₫"
                  }
                ]
              },
              {
                groupDto: {
                  groupId: 470,
                  orderNumber: 105,
                  image: "https://cdn.tgdd.vn/Products/Images/42/311354/TimerThumb/oppo-a58-4g-(48).jpg",
                  type: "PHONE"
                },
                products: [
                  {
                    productId: "67cff272b6dd012f66cbba08",
                    variant: null,
                    orderNumber: 1,
                    productName: "Điện thoại OPPO A58 8GB/128GB",
                    defaultOriginalPrice: null,
                    defaultCurrentPrice: "4.790.000₫"
                  }
                ]
              }
            ],
            totalPages: 5,
            totalElements: 50
          };

          // Filter for search query
          const filteredResults = {
            ...mockResults,
            content: mockResults.content.filter(item => 
              item.products.some(p => 
                p.productName.toLowerCase().includes(query.toLowerCase())
              )
            )
          };
          
          setProducts(filteredResults.content);
          setTotalPages(filteredResults.totalPages);
          setTotalResults(filteredResults.totalElements);
          setError(null);
        }, 1000);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setSearchParams({ q: query, page: newPage.toString() });
      window.scrollTo(0, 0);
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
      </h1>
      
      {/* Search form */}
      <div className="mb-8">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const searchQuery = formData.get('search-query');
            if (searchQuery) {
              setSearchParams({ q: searchQuery, page: '0' });
            }
          }}
          className="flex w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            name="search-query"
            defaultValue={query}
            placeholder="Nhập từ khóa tìm kiếm..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-r-md hover:bg-indigo-700 flex items-center"
          >
            <FaSearch className="mr-2" />
            Tìm kiếm
          </button>
        </form>
      </div>
      
      {query && !loading && !error && (
        <div className="mb-6 text-gray-600">
          Tìm thấy {totalResults} kết quả cho "{query}"
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={toggleFilter}
            className="w-full flex items-center justify-center py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <FaFilter className="mr-2" />
            {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
        
        {/* Sidebar with filters */}
        <div className={`w-full md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h2>
            
            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Danh mục</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id="category-all" 
                    type="radio" 
                    name="category" 
                    value="all" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                    defaultChecked 
                  />
                  <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
                    Tất cả
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="category-phone" 
                    type="radio" 
                    name="category" 
                    value="phone" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="category-phone" className="ml-2 text-sm text-gray-700">
                    Điện thoại
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="category-laptop" 
                    type="radio" 
                    name="category" 
                    value="laptop" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="category-laptop" className="ml-2 text-sm text-gray-700">
                    Laptop
                  </label>
                </div>
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Giá</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id="price-all" 
                    type="radio" 
                    name="price-range" 
                    value="all" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                    defaultChecked 
                  />
                  <label htmlFor="price-all" className="ml-2 text-sm text-gray-700">
                    Tất cả
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="price-1" 
                    type="radio" 
                    name="price-range" 
                    value="0-2000000" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="price-1" className="ml-2 text-sm text-gray-700">
                    Dưới 2 triệu
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="price-2" 
                    type="radio" 
                    name="price-range" 
                    value="2000000-5000000" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="price-2" className="ml-2 text-sm text-gray-700">
                    Từ 2 - 5 triệu
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="price-3" 
                    type="radio" 
                    name="price-range" 
                    value="5000000-10000000" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="price-3" className="ml-2 text-sm text-gray-700">
                    Từ 5 - 10 triệu
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="price-4" 
                    type="radio" 
                    name="price-range" 
                    value="10000000-" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="price-4" className="ml-2 text-sm text-gray-700">
                    Trên 10 triệu
                  </label>
                </div>
              </div>
            </div>
            
            {/* Brand Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Thương hiệu</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id="brand-all" 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                    defaultChecked 
                  />
                  <label htmlFor="brand-all" className="ml-2 text-sm text-gray-700">
                    Tất cả
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="brand-apple" 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                  />
                  <label htmlFor="brand-apple" className="ml-2 text-sm text-gray-700">
                    Apple
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="brand-samsung" 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                  />
                  <label htmlFor="brand-samsung" className="ml-2 text-sm text-gray-700">
                    Samsung
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="brand-xiaomi" 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                  />
                  <label htmlFor="brand-xiaomi" className="ml-2 text-sm text-gray-700">
                    Xiaomi
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="brand-oppo" 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                  />
                  <label htmlFor="brand-oppo" className="ml-2 text-sm text-gray-700">
                    OPPO
                  </label>
                </div>
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <button
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Áp dụng
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-grow">
          {!query && !loading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Nhập từ khóa để tìm kiếm sản phẩm
              </h2>
              <p className="text-gray-500">
                Bạn có thể tìm kiếm theo tên sản phẩm, hãng, hoặc loại sản phẩm.
              </p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} loading={loading} error={error} />
              
              {!loading && !error && totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;