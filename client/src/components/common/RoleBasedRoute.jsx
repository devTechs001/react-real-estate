import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loader from './Loader';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

/**
 * RoleBasedRoute Component
 * Protects routes based on user authentication and role
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {string|string[]} allowedRoles - Role(s) allowed to access this route
 * @param {string} redirectTo - Path to redirect unauthorized users (default: '/login')
 */
const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [hasShownToast, setHasShownToast] = useState(false);

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  useEffect(() => {
    // Show toast only once when user is authenticated but doesn't have permission
    if (!loading && isAuthenticated && user && !hasShownToast) {
      const hasPermission = rolesArray.length === 0 || rolesArray.includes(user.role);
      
      if (!hasPermission) {
        toast.error('You do not have permission to access this page');
        setHasShownToast(true);
      }
    }
  }, [loading, isAuthenticated, user, rolesArray, hasShownToast]);

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based permissions
  if (rolesArray.length > 0 && user) {
    const hasPermission = rolesArray.includes(user.role);
    
    if (!hasPermission) {
      // Redirect based on user role
      const roleRedirects = {
        user: '/client/dashboard',
        agent: '/seller/dashboard',
        admin: '/admin/dashboard',
      };
      
      const defaultRedirect = roleRedirects[user.role] || '/';
      return <Navigate to={defaultRedirect} replace />;
    }
  }

  // User is authenticated and has permission
  return children;
};

export default RoleBasedRoute;

