import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_URL = `${API_URL}/auth`;

// Token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

class AuthService {
  // Get stored token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set token
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  // Get stored user data
  getStoredUser() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Set user data
  setStoredUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  // Configure axios with auth token
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Register new user
  async register(userData) {
    try {
      const response = await axios.post(`${AUTH_URL}/register`, userData);

      // Response format: { success, message, token, user }
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      if (response.data.user) {
        this.setStoredUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Register service error:', error.response?.data || error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, {
        email,
        password,
      });

      // Response format: { success, message, token, user }
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      if (response.data.user) {
        this.setStoredUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Login service error:', error.response?.data || error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await axios.get(`${AUTH_URL}/me`, {
        headers: this.getAuthHeader(),
      });

      // Response format: { success, user }
      if (response.data.success && response.data.user) {
        this.setStoredUser(response.data.user);
        return response.data.user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error);
      // Clear invalid token
      this.logout();
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await axios.put(`${AUTH_URL}/profile`, userData, {
        headers: this.getAuthHeader(),
      });
      
      if (response.data.user) {
        this.setStoredUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error);
      throw error;
    }
  }

  // Update password
  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put(
        `${AUTH_URL}/update-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: this.getAuthHeader(),
        }
      );
      
      // Update token if a new one is provided
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update password error:', error.response?.data || error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${AUTH_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(resetToken, password) {
    try {
      const response = await axios.post(
        `${AUTH_URL}/reset-password/${resetToken}`,
        { password }
      );
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      if (response.data.user) {
        this.setStoredUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(verificationToken) {
    try {
      const response = await axios.post(
        `${AUTH_URL}/verify-email/${verificationToken}`
      );
      
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      if (response.data.user) {
        this.setStoredUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error.response?.data || error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    try {
      const response = await axios.post(`${AUTH_URL}/resend-verification`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error.response?.data || error);
      throw error;
    }
  }

  // Logout
  logout() {
    try {
      // Call logout endpoint (optional - can be async)
      const token = this.getToken();
      if (token) {
        axios.post(`${AUTH_URL}/logout`, {}, {
          headers: this.getAuthHeader(),
        }).catch(err => console.error('Logout API error:', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      this.setToken(null);
      this.setStoredUser(null);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Role management (admin only)
  async getAllRoles() {
    try {
      const response = await axios.get(`${AUTH_URL}/roles`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Get roles error:', error.response?.data || error);
      throw error;
    }
  }

  async getRolePermissions(role) {
    try {
      const response = await axios.get(`${AUTH_URL}/roles/${role}/permissions`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Get role permissions error:', error.response?.data || error);
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await axios.put(
        `${AUTH_URL}/users/${userId}/role`,
        { role },
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update user role error:', error.response?.data || error);
      throw error;
    }
  }
}

export const authService = new AuthService();