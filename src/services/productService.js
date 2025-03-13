// services/productService.js
import axiosInstance from '../utils/axiosConfig';

export const productService = {
  // Get products by type with pagination
  // services/productService.js - cập nhật phương thức getProductsByType
// services/productService.js
// services/productService.js - updated getProductsByType method
async getProductsByType(type, page = 0, size = 20) {
  try {
    console.log(`Fetching products: /group-variants/groups?page=${page}&size=${size}&type=${type}`);
    
    const response = await axiosInstance.get(
      `/group-variants/groups?page=${page}&size=${size}&type=${type}`
    );
    
    // Log the response for debugging
    console.log('API Response:', response.data);
    
    // Check if the response includes the expected page number
    if (response.data && response.data.currentPage !== page) {
      console.warn(`Requested page ${page} but received page ${response.data.currentPage}. This might cause issues.`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error);
    throw error;
  }
},

  // Get product details by ID
  async getProductById(productId) {
    try {
      const response = await axiosInstance.get(`/products/getPhone/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  // Get product variants by product ID
  async getProductVariants(productId) {
    try {
      const response = await axiosInstance.get(`/inventory/related/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product variants:', error);
      throw error;
    }
  },

  // Add product to cart (send request to backend)
  async addToCart(productId, quantity, color) {
    try {
      const response = await axiosInstance.post('/cart/add', {
        productId,
        quantity,
        color
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  },

  // Get cart items
  async getCartItems() {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(cartItemId, quantity) {
    try {
      const response = await axiosInstance.put(`/cart/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeCartItem(cartItemId) {
    try {
      const response = await axiosInstance.delete(`/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(query, page = 0, size = 10) {
    try {
      const response = await axiosInstance.get(
        `/products/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Format price string (remove non-numeric characters and parse)
  formatPrice(priceString) {
    if (!priceString) return null;
    // Remove all non-numeric characters and parse to number
    return parseInt(priceString.replace(/[^\d]/g, ''), 10);
  },

  // Format price for display
  formatPriceDisplay(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  }
};