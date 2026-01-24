# Role-Based Access Control (RBAC) Documentation

## Overview
This application implements a comprehensive Role-Based Access Control system with three user roles:
- **User** (Client) - Regular users looking for properties
- **Agent** (Seller) - Real estate agents managing properties
- **Admin** - System administrators with full access

## User Roles

### 1. User (Client)
**Role Value:** `user`

**Permissions:**
- View all properties
- Favorite/save properties
- Create inquiries
- Book appointments
- View own inquiries and appointments
- Send/receive messages
- Compare properties
- Save search criteria
- View browsing history
- Access AI features (price prediction, recommendations)

**Routes:**
- `/client/dashboard` - Client dashboard
- `/client/favorites` - Saved properties
- `/client/inquiries` - My inquiries
- `/client/appointments` - My appointments
- `/client/messages` - Messages
- `/client/comparison` - Property comparison
- `/client/saved-searches` - Saved searches
- `/client/view-history` - Viewing history

### 2. Agent (Seller)
**Role Value:** `agent`

**Permissions:**
- All User permissions
- Create/edit/delete own properties
- View and respond to inquiries
- Manage appointments
- View analytics and reports
- Manage reviews
- Manage subscriptions
- Access seller dashboard

**Routes:**
- `/seller/dashboard` - Seller dashboard
- `/seller/properties` - Manage properties
- `/seller/inquiries` - Manage inquiries
- `/seller/appointments` - Manage appointments
- `/seller/analytics` - View analytics
- `/seller/messages` - Messages
- `/seller/reviews` - Customer reviews
- `/seller/subscriptions` - Subscription management

### 3. Admin
**Role Value:** `admin`

**Permissions:**
- All Agent permissions
- View/edit/delete all users
- View/edit/delete all properties
- Approve/reject properties
- View system analytics
- Manage system settings
- Access all reports
- Moderate content

**Routes:**
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/properties` - Property management
- `/admin/reports` - System reports
- `/admin/system` - System settings

## Frontend Implementation

### Components

#### 1. RoleBasedRoute
Protects routes based on user role.

```jsx
import RoleBasedRoute from '@/components/common/RoleBasedRoute';

<Route path="admin/dashboard" element={
  <RoleBasedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </RoleBasedRoute>
} />
```

#### 2. ProtectedFeature
Conditionally renders features based on permissions.

```jsx
import ProtectedFeature from '@/components/common/ProtectedFeature';

<ProtectedFeature action="create_property">
  <button>Add Property</button>
</ProtectedFeature>

<ProtectedFeature feature="admin_dashboard">
  <AdminPanel />
</ProtectedFeature>
```

### Hooks

#### 1. useAuth
Access authentication state and role information.

```jsx
const { user, isAuthenticated, hasRole, isAdmin, isAgent, isUser } = useAuth();

if (isAdmin()) {
  // Show admin features
}
```

#### 2. usePermissions
Check granular permissions.

```jsx
const { can, canAccess, isOwner, canEdit, canDelete } = usePermissions();

if (can('create_property')) {
  // Show create property button
}

if (canEdit(propertyOwnerId)) {
  // Show edit button
}
```

## Backend Implementation

### Middleware

#### 1. protect
Verifies JWT token and attaches user to request.

```javascript
import { protect } from '../middleware/auth.js';

router.get('/profile', protect, getProfile);
```

#### 2. authorize
Checks if user has required role(s).

```javascript
import { protect, authorize } from '../middleware/auth.js';

router.post('/properties', protect, authorize('agent', 'admin'), createProperty);
```

#### 3. Role-specific middleware
```javascript
import { adminOnly, agentOrAdmin, ownerOrAdmin } from '../middleware/roleMiddleware.js';

// Admin only
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Agent or Admin
router.get('/analytics', protect, agentOrAdmin, getAnalytics);

// Owner or Admin
router.put('/properties/:id', protect, ownerOrAdmin('user'), updateProperty);
```

## Permission Matrix

| Feature | User | Agent | Admin |
|---------|------|-------|-------|
| View Properties | ✓ | ✓ | ✓ |
| Create Property | ✗ | ✓ | ✓ |
| Edit Own Property | ✗ | ✓ | ✓ |
| Edit Any Property | ✗ | ✗ | ✓ |
| Delete Own Property | ✗ | ✓ | ✓ |
| Delete Any Property | ✗ | ✗ | ✓ |
| View Users | ✗ | ✗ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |
| View Analytics | ✗ | ✓ | ✓ |
| System Settings | ✗ | ✗ | ✓ |

## Testing Permissions

### Frontend Testing
```javascript
// Test role-based routing
const { user } = useAuth();
expect(user.role).toBe('admin');

// Test permissions
const { can } = usePermissions();
expect(can('create_property')).toBe(true);
```

### Backend Testing
```javascript
// Test with different roles
const adminToken = getAdminToken();
const response = await request(app)
  .get('/api/admin/users')
  .set('Authorization', `Bearer ${adminToken}`);
  
expect(response.status).toBe(200);
```

