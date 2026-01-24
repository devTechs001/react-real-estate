import { useAuth } from './useAuth';

/**
 * Custom hook for checking user permissions
 * Provides granular permission checking for features and actions
 */
export const usePermissions = () => {
  const { user, isAuthenticated, hasRole, hasAnyRole } = useAuth();

  /**
   * Check if user can perform a specific action
   * @param {string} action - The action to check (e.g., 'create_property', 'edit_user')
   * @returns {boolean}
   */
  const can = (action) => {
    if (!isAuthenticated || !user) return false;

    // Define permissions for each role
    const permissions = {
      admin: [
        'view_all_users',
        'create_user',
        'edit_user',
        'delete_user',
        'view_all_properties',
        'create_property',
        'edit_property',
        'delete_property',
        'view_analytics',
        'view_reports',
        'manage_system',
        'manage_subscriptions',
        'view_all_messages',
        'moderate_content',
      ],
      agent: [
        'view_own_properties',
        'create_property',
        'edit_own_property',
        'delete_own_property',
        'view_inquiries',
        'respond_to_inquiries',
        'manage_appointments',
        'view_analytics',
        'view_messages',
        'manage_reviews',
        'manage_subscriptions',
      ],
      user: [
        'view_properties',
        'favorite_properties',
        'create_inquiry',
        'book_appointment',
        'view_own_inquiries',
        'view_own_appointments',
        'view_messages',
        'compare_properties',
        'save_searches',
        'view_history',
      ],
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(action);
  };

  /**
   * Check if user can access a specific feature
   * @param {string} feature - The feature to check
   * @returns {boolean}
   */
  const canAccess = (feature) => {
    if (!isAuthenticated || !user) return false;

    const featureAccess = {
      // Client features
      client_dashboard: ['user'],
      favorites: ['user'],
      inquiries: ['user', 'agent'],
      appointments: ['user', 'agent'],
      comparison: ['user'],
      saved_searches: ['user'],
      view_history: ['user'],
      
      // Agent/Seller features
      seller_dashboard: ['agent'],
      manage_properties: ['agent', 'admin'],
      analytics: ['agent', 'admin'],
      reviews: ['agent'],
      subscriptions: ['agent'],
      
      // Admin features
      admin_dashboard: ['admin'],
      user_management: ['admin'],
      system_management: ['admin'],
      reports: ['admin'],
      
      // AI features
      price_prediction: ['user', 'agent', 'admin'],
      market_analytics: ['user', 'agent', 'admin'],
      recommendations: ['user', 'agent', 'admin'],
      chatbot: ['user', 'agent', 'admin'],
    };

    const allowedRoles = featureAccess[feature] || [];
    return allowedRoles.includes(user.role);
  };

  /**
   * Check if user owns a resource
   * @param {string} resourceOwnerId - The ID of the resource owner
   * @returns {boolean}
   */
  const isOwner = (resourceOwnerId) => {
    if (!isAuthenticated || !user) return false;
    return user._id === resourceOwnerId || user.id === resourceOwnerId;
  };

  /**
   * Check if user can edit a resource
   * @param {string} resourceOwnerId - The ID of the resource owner
   * @returns {boolean}
   */
  const canEdit = (resourceOwnerId) => {
    if (!isAuthenticated || !user) return false;
    // Admins can edit anything, others can only edit their own resources
    return hasRole('admin') || isOwner(resourceOwnerId);
  };

  /**
   * Check if user can delete a resource
   * @param {string} resourceOwnerId - The ID of the resource owner
   * @returns {boolean}
   */
  const canDelete = (resourceOwnerId) => {
    if (!isAuthenticated || !user) return false;
    // Admins can delete anything, others can only delete their own resources
    return hasRole('admin') || isOwner(resourceOwnerId);
  };

  return {
    can,
    canAccess,
    isOwner,
    canEdit,
    canDelete,
    // Re-export role checking functions
    hasRole,
    hasAnyRole,
  };
};

