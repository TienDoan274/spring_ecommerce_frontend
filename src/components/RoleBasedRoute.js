// components/RoleBasedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Route component that only allows access to users with specific roles
 * @param {Object} props
 * @param {string|string[]} props.requiredRoles - Role(s) required to access the route (without ROLE_ prefix)
 * @param {string} props.redirectPath - Path to redirect to if unauthorized
 * @param {React.ReactNode} props.unauthorizedComponent - Optional component to show instead of redirecting
 */
const RoleBasedRoute = ({ 
  requiredRoles, 
  redirectPath = '/dashboard',
  unauthorizedComponent = null
}) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle role-based authorization
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasRequiredRole = roles.some(role => hasRole(role));

  // If user doesn't have required role, redirect or show unauthorized component
  if (!hasRequiredRole) {
    if (unauthorizedComponent) {
      return unauthorizedComponent;
    }
    return <Navigate to={redirectPath} replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default RoleBasedRoute;