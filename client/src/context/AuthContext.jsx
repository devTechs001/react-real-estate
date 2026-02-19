import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        
        if (token) {
          // Token exists, verify with backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Token invalid or expired, clear it
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);

      // Response should contain: { success: true, token, user, message }
      if (response.user) {
        setUser(response.user);
        toast.success(response.message || 'Login successful!');
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      setLoading(true);
      
      // Transform form data for backend
      const registerData = {
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role || 'user',
      };

      const response = await authService.register(registerData);
      
      // Response should contain: { success: true, token, user, message }
      if (response.user) {
        setUser(response.user);
        toast.success(response.message || 'Registration successful!');
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Store current location to redirect back after OAuth
      localStorage.setItem('oauth_redirect', window.location.pathname);
      window.location.href = `${apiUrl}/api/auth/google`;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initiate Google login');
    }
  }, []);

  const loginWithGithub = useCallback(() => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Store current location to redirect back after OAuth
      localStorage.setItem('oauth_redirect', window.location.pathname);
      window.location.href = `${apiUrl}/api/auth/github`;
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('Failed to initiate GitHub login');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(userData);
      
      if (response.user) {
        setUser(response.user);
        toast.success('Profile updated successfully');
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, user might be logged out
      authService.logout();
      setUser(null);
      throw error;
    }
  }, []);

  // Role checking helper functions
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isAgent = useCallback(() => user?.role === 'agent', [user]);
  const isUser = useCallback(() => user?.role === 'user', [user]);

  const value = {
    user,
    loading,
    isInitialized,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
    // Role helpers
    hasRole,
    hasAnyRole,
    isAdmin,
    isAgent,
    isUser,
  };

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};