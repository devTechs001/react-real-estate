# API Endpoints & Navigation Guide

## ✅ COMMIT STATUS
- **Commit**: ✅ Changes committed successfully
- **Tailwind CSS**: ✅ Configured (stable version with PostCSS & Autoprefixer)
- **Admin Components**: ✅ All 7 components populated with full implementations

---

## 🔌 API ENDPOINTS

### **Authentication Routes** (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update user profile (Protected)

### **Properties Routes** (`/api/properties`)
- `GET /` - Get all properties
- `POST /` - Create property (Protected, with image upload)
- `GET /user/my-properties` - Get user's properties (Protected)
- `GET /:id` - Get property details
- `PUT /:id` - Update property (Protected)
- `DELETE /:id` - Delete property (Protected)

### **Reviews Routes** (`/api/reviews`)
- `GET /property/:propertyId` - Get property reviews
- `GET /user/my-reviews` - Get user's reviews (Protected)
- `POST /` - Create review (Protected)
- `PUT /:id` - Update review (Protected)
- `DELETE /:id` - Delete review (Protected)

### **AI Routes** (`/api/ai`)
- `POST /chat` - Chat with AI (Rate limited)
- `POST /predict-price` - Predict property price (Rate limited)
- `POST /enhance-search` - Enhance search (Rate limited)
- `POST /market-insights` - Get market insights (Rate limited)
- `GET /recommendations` - Get recommendations (Protected)
- `POST /analyze-image` - Analyze property image (Protected)
- `POST /generate-description` - Generate description (Protected)
- `POST /fraud-detection` - Detect fraud (Admin only)
- `POST /train-model` - Train model (Admin only)

### **Messages Routes** (`/api/messages`)
- `GET /conversations` - Get conversations (Protected)
- `GET /:conversationId` - Get messages (Protected)
- `POST /` - Send message (Protected)
- `PUT /:conversationId/read` - Mark as read (Protected)
- `DELETE /:conversationId` - Delete conversation (Protected)

### **Inquiries Routes** (`/api/inquiries`)
- `POST /` - Create inquiry (Protected)
- `GET /my-inquiries` - Get user's inquiries (Protected)
- `GET /received` - Get received inquiries (Protected)
- `PUT /:id/respond` - Respond to inquiry (Protected)
- `PUT /:id/status` - Update inquiry status (Protected)

### **Appointments Routes** (`/api/appointments`)
- `POST /` - Request appointment (Protected)
- `GET /my-appointments` - Get my appointments (Protected)
- `GET /received` - Get received appointments (Protected)
- `PUT /:id/status` - Update status (Protected)
- `PUT /:id/cancel` - Cancel appointment (Protected)

### **Favorites Routes** (`/api/favorites`)
- `GET /` - Get favorites (Protected)
- `POST /` - Add favorite (Protected)
- `GET /check/:propertyId` - Check if favorite (Protected)
- `PUT /:id` - Update favorite (Protected)
- `DELETE /:propertyId` - Remove favorite (Protected)

### **Notifications Routes** (`/api/notifications`)
- `GET /` - Get notifications (Protected)
- `GET /unread-count` - Get unread count (Protected)
- `PUT /:id/read` - Mark as read (Protected)
- `PUT /mark-all-read` - Mark all as read (Protected)
- `DELETE /:id` - Delete notification (Protected)

### **Saved Searches Routes** (`/api/saved-searches`)
- `GET /` - Get saved searches (Protected)
- `POST /` - Create saved search (Protected)
- `PUT /:id` - Update search (Protected)
- `DELETE /:id` - Delete search (Protected)
- `GET /:id/matches` - Get matching properties (Protected)

### **Payments Routes** (`/api/payments`)
- `POST /webhook` - Webhook endpoint
- `POST /create-subscription` - Create subscription (Protected)
- `POST /cancel-subscription` - Cancel subscription (Protected)
- `GET /subscription` - Get subscription (Protected)
- `GET /history` - Get payment history (Protected)

### **Analytics Routes** (`/api/analytics`)
- `GET /seller` - Get seller analytics (Protected)
- `POST /track-view/:propertyId` - Track property view

### **Admin Routes** (`/api/admin`)
- `GET /dashboard-stats` - Dashboard statistics (Admin)
- `GET /users` - Get all users (Admin)
- `PUT /users/:id/role` - Update user role (Admin)
- `PUT /users/:id/status` - Update user status (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `GET /properties` - Get properties (Admin)
- `PUT /properties/:id/approve` - Approve property (Admin)
- `PUT /properties/:id/reject` - Reject property (Admin)
- `DELETE /properties/:id` - Delete property (Admin)

### **Upload Routes** (`/api/upload`)
- `POST /image` - Upload single image (Protected)
- `POST /images` - Upload multiple images (Protected)
- `DELETE /image/:publicId` - Delete image (Protected)

### **Referral Routes** (`/api/referrals`)
- Manages referral links and rewards (Protected)

---

## 🧭 CLIENT NAVIGATION STRUCTURE

### **Public Routes**
```
/ - Home page
/properties - Browse all properties
/properties/:id - Property detail page
/login - Login page
/register - Registration page
/price-prediction - AI price prediction
/market-analytics - Market analytics
/invite/:code - Invite link
```

### **Client Routes** (`/client`) - User Role
```
/client/dashboard - Client dashboard
/client/favorites - Saved favorites
/client/inquiries - My inquiries
/client/appointments - My appointments
/client/messages - Messages
/client/saved-searches - Saved searches
/client/view-history - View history
/client/comparison - Property comparison
```

### **Seller Routes** (`/seller`) - Agent Role
```
/seller/dashboard - Seller dashboard
/seller/properties - Manage properties
/seller/inquiries - Manage inquiries
/seller/appointments - Manage appointments
/seller/analytics - Sales analytics
/seller/messages - Messages
/seller/reviews - Client reviews
/seller/subscriptions - Subscription plans
/seller/referrals - Referral program
```

### **Admin Routes** (`/admin`) - Admin Role
```
/admin/dashboard - Admin dashboard
/admin/users - User management
/admin/properties - Property moderation
/admin/reports - System reports
/admin/system - System settings
```

### **Common Protected Routes**
```
/dashboard - Auto-redirects to role dashboard
/profile - User profile
/settings - User settings
/add-property - Add new property
/edit-property/:id - Edit property
```

---

## 🔒 AUTHENTICATION & ROLE-BASED ACCESS

### **User Roles**
- **user** - Regular client/buyer
- **agent** - Property seller/listing agent
- **admin** - System administrator

### **Protection Mechanisms**
1. `protect` - Requires authentication
2. `authorize('role')` - Requires specific role
3. `RoleBasedRoute` - Frontend role checking
4. `PrivateRoute` - Frontend authentication checking

---

## ✅ COMPONENT STATUS

### **Admin Components** ✅
All 7 admin components are fully implemented with:
- Tailwind CSS styling
- API integration
- State management
- Error handling
- Loading states

1. ✅ **AdminDashboard.jsx** - Dashboard with stats & charts
2. ✅ **UserManagement.jsx** - User list, search, role management
3. ✅ **SystemSettings.jsx** - System configuration panel
4. ✅ **FraudDetection.jsx** - Fraud alert monitoring
5. ✅ **PropertyModeration.jsx** - Property approval workflow
6. ✅ **ReportManagement.jsx** - User report handling
7. ✅ **SystemAnalytics.jsx** - Analytics & metrics

---

## 🚀 KEY FEATURES ENABLED

- ✅ **Real-time Messaging** (WebSocket)
- ✅ **AI Chatbot** (OpenAI integration)
- ✅ **Price Prediction** (ML model)
- ✅ **Market Analytics** (Trends & insights)
- ✅ **Fraud Detection** (Suspicious activity)
- ✅ **Smart Recommendations** (Personalized)
- ✅ **Appointment Scheduling**
- ✅ **Inquiry Management**
- ✅ **Payment Processing** (Stripe)
- ✅ **Property Moderation**
- ✅ **User Management**
- ✅ **Role-Based Access Control**

---

## 📝 NOTES

- All protected routes require JWT token in `Authorization: Bearer <token>`
- API rate limiting applied to AI routes
- Admin routes require admin role authorization
- WebSocket enabled for real-time features
- CORS enabled for client communication
- Error handling middleware active

---

**Last Updated**: January 25, 2026
**Status**: ✅ All endpoints documented and navigation configured
