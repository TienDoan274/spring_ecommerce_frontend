// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Modification to App.js
// Update the routes section to handle development components

// ...existing imports

// Development placeholder (temporary)
const DevelopmentPlaceholder = ({ componentName }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <p className="font-bold">Development in Progress</p>
      <p>The {componentName} component is currently being developed.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:type" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            
            {/* Protected Routes for Authenticated Users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<DevelopmentPlaceholder componentName="Checkout" />} />
            </Route>
            
            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route element={<RoleBasedRoute requiredRoles="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;