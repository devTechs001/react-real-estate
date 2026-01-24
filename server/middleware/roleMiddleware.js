/**
 * Role-based Access Control Middleware
 * Protects routes based on user roles
 */

/**
 * Middleware to check if user has required role(s)
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

/**
 * Middleware to check if user is agent or admin
 */
export const agentOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  if (!['agent', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Agent or Admin privileges required.',
    });
  }

  next();
};

/**
 * Middleware to check if user owns the resource or is admin
 * @param {string} resourceField - Field name containing the resource owner ID (default: 'user')
 */
export const ownerOrAdmin = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceOwnerId = req.resource?.[resourceField]?.toString() || 
                           req.resource?.[resourceField];
    const userId = req.user._id?.toString() || req.user.id?.toString();

    if (resourceOwnerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      });
    }

    next();
  };
};

/**
 * Middleware to attach resource to request for ownership checking
 * @param {Function} getResource - Function to fetch the resource
 */
export const attachResource = (getResource) => {
  return async (req, res, next) => {
    try {
      const resource = await getResource(req);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching resource',
        error: error.message,
      });
    }
  };
};

/**
 * Permission checking helper
 * @param {Object} user - User object
 * @param {string} action - Action to check
 * @returns {boolean}
 */
export const hasPermission = (user, action) => {
  if (!user) return false;

  const permissions = {
    admin: ['*'], // Admin has all permissions
    agent: [
      'create_property',
      'edit_own_property',
      'delete_own_property',
      'view_inquiries',
      'manage_appointments',
      'view_analytics',
    ],
    user: [
      'view_properties',
      'create_inquiry',
      'book_appointment',
      'favorite_properties',
    ],
  };

  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes('*') || userPermissions.includes(action);
};

