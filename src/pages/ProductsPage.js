  // pages/ProductsPage.js
  import React, { useState, useEffect, useRef, useMemo } from 'react';
  import { useParams, useSearchParams, useLocation, useNavigate  } from 'react-router-dom';
  import ProductGrid from '../components/ProductGrid';
  import { productService } from '../services/productService';
  import { FaSort } from 'react-icons/fa';

  const ProductsPage = () => {
    const { type } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); // Thêm hook này
    const navigate = useNavigate(); // Thêm hook navigate

    // Chỉ lấy trang từ URL để hiển thị
    const urlPage = parseInt(searchParams.get('page') || '0', 10);
    
    // Theo dõi trang hiện tại và số lần đã tải
    const currentPageRef = useRef(0);
    const isFirstRenderRef = useRef(true);
    const typeRef = useRef(type);
    
    // State chính
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    
    const pageSize = 20;
    
    // Xác định tiêu đề trang dựa trên loại sản phẩm
    const pageTitle = useMemo(() => {
      return type?.toLowerCase() === 'phone' 
        ? 'Điện thoại' 
        : type?.toLowerCase() === 'laptop' 
          ? 'Laptop' 
          : 'Sản phẩm';
    }, [type]);

    useEffect(() => {
      // Kiểm tra nếu type thay đổi từ phone sang laptop hoặc ngược lại
      const shouldReload = 
        type !== typeRef.current && 
        (type === 'phone' || type === 'laptop');
  
      if (shouldReload) {
        console.log('Đường dẫn thay đổi, tải lại dữ liệu:', location.pathname, location.search);
        
        // Reset trang về 0
        const page = 0;
        
        // Cập nhật refs
        typeRef.current = type;
        currentPageRef.current = page;
        
        // Reset sản phẩm và tải lại
        setAllProducts([]);
        loadProductsForPage(page, false);
        
        // Cập nhật URL nếu cần
        setSearchParams({ page: page.toString() });
      }
    }, [location.pathname, location.search, type]);

    const loadProductsForPage = async (page, isLoadMore = false) => {
      if (!type) return;
      
      setLoading(true);
      try {
        const productType = type.toUpperCase();
        console.log(`Đang tải ${productType} sản phẩm, trang ${page}, kích thước ${pageSize}, isLoadMore: ${isLoadMore}`);
        
        const response = await productService.getProductsByType(productType, page, pageSize);
        console.log('Phản hồi API cho trang', page, ':', response);
        
        if (response && response.content && Array.isArray(response.content)) {
          if (isLoadMore) {
            // Thêm sản phẩm mới vào danh sách hiện có
            setAllProducts(prevProducts => {
              // Sử dụng Set để kiểm tra trùng lặp chính xác hơn
              const existingIds = new Set(prevProducts.map(p => 
                p.groupDto?.groupId || (p.id ? p.id.toString() : null)
              ));
              
              const newProducts = response.content.filter(p => 
                !existingIds.has(p.groupDto?.groupId || (p.id ? p.id.toString() : null))
              );
              
              console.log(`Thêm ${newProducts.length} sản phẩm mới vào ${prevProducts.length} sản phẩm hiện có`);
              return [...prevProducts, ...newProducts];
            });
          } else {
            // Đặt lại danh sách sản phẩm nếu không phải là "load more"
            console.log(`Đặt lại danh sách sản phẩm với ${response.content.length} sản phẩm`);
            setAllProducts(response.content);
          }
          
          setTotalPages(response.totalPages || 1);
          currentPageRef.current = page;
          
          // Cập nhật URL
          setSearchParams({ page: page.toString() });
        } else {
          console.error('Định dạng phản hồi không mong đợi:', response);
          setError('Định dạng dữ liệu không đúng');
        }
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    // Xử lý nút "Xem thêm sản phẩm"
    const handleLoadMore = () => {
      const nextPage = currentPageRef.current + 1;
      if (nextPage < totalPages) {
        loadProductsForPage(nextPage, true);
      }
    };

    // Xử lý tải lại
    const handleReload = () => {
      currentPageRef.current = 0;
      loadProductsForPage(0, false);
    };

    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{pageTitle}</h1>
        
        {/* Container nội dung chính */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Khu vực nội dung chính */}
          <div className="flex-grow">
            {/* Tùy chọn sắp xếp */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <FaSort className="text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 mr-2">Sắp xếp:</span>
                  <select className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="popularity">Phổ biến</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  {!loading && allProducts.length > 0 && (
                    <span>Hiển thị {allProducts.length} sản phẩm</span>
                  )}
                  
                  {/* Nút tải lại */}
                  <button 
                    onClick={handleReload}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Tải lại
                  </button>
                </div>
              </div>
            </div>
            
            {/* Lưới sản phẩm */}
            <ProductGrid 
              products={allProducts} 
              loading={loading} 
              error={error} 
            />
            
            {/* DEBUG: Thông tin trang */}
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Trang hiện tại: {currentPageRef.current}, Tổng trang: {totalPages}</p>
              <p>Số sản phẩm: {allProducts.length}</p>
            </div>
            
            {/* Nút "Xem thêm sản phẩm" */}
            <div className="mt-8 flex flex-col items-center">
              {currentPageRef.current < totalPages - 1 && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md ${
                    loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {loading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                </button>
              )}
              
              {/* Thông tin trang */}
              <p className="text-gray-500 mt-4 text-center">
                Đã hiển thị {allProducts.length} sản phẩm
                {totalPages > 0 && ` (Trang ${currentPageRef.current + 1}/${totalPages})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductsPage;