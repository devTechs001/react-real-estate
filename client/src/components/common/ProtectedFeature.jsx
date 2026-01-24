import { usePermissions } from '@/hooks/usePermissions';

/**
 * ProtectedFeature Component
 * Conditionally renders children based on user permissions
 * 
 * @param {React.ReactNode} children - Content to render if user has permission
 * @param {string} action - Action permission to check (e.g., 'create_property')
 * @param {string} feature - Feature access to check (e.g., 'admin_dashboard')
 * @param {string} resourceOwnerId - Resource owner ID for ownership checks
 * @param {React.ReactNode} fallback - Content to render if user doesn't have permission
 * @param {boolean} requireOwnership - Whether to check resource ownership
 */
const ProtectedFeature = ({ 
  children, 
  action,
  feature,
  resourceOwnerId,
  fallback = null,
  requireOwnership = false,
}) => {
  const { can, canAccess, isOwner, canEdit } = usePermissions();

  let hasPermission = true;

  // Check action permission
  if (action) {
    hasPermission = hasPermission && can(action);
  }

  // Check feature access
  if (feature) {
    hasPermission = hasPermission && canAccess(feature);
  }

  // Check ownership
  if (requireOwnership && resourceOwnerId) {
    hasPermission = hasPermission && (isOwner(resourceOwnerId) || canEdit(resourceOwnerId));
  }

  return hasPermission ? children : fallback;
};

export default ProtectedFeature;

