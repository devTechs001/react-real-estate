import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children, roles = [], allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  // Handle both 'roles' and 'allowedRoles' props for compatibility
  const requiredRoles = roles.length > 0 ? roles : allowedRoles;

  console.log('🛡️ ProtectedRoute Check:', {
    loading,
    isAuthenticated,
    user: user?.email,
    userRole: user?.role,
    requiredRoles,
    path: location.pathname
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if roles are specified
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    console.log('🚫 ProtectedRoute: Insufficient permissions', {
      userRole: user?.role,
      requiredRoles
    });
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;