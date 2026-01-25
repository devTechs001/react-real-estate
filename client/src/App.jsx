import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/common/SplashScreen';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/common/PrivateRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import ChatBot from './components/ai/Chatbot';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';

// AI Pages
import PricePrediction from './components/ai/PricePrediction';
import MarketAnalytics from './components/ai/MarketAnalysis';
import PropertyRecommendations from './components/ai/PropertyRecommendations';

// Client Pages
import ClientDashboard from './components/client/ClientDashboard';
import ClientFavorites from './pages/client/Favorites';
import ClientInquiries from './pages/client/MyInquiries';
import ClientAppointments from './pages/client/MyAppointments';
import ClientMessages from './pages/client/Messages';
import SavedSearches from './pages/client/SavedSearches';
import ViewHistory from './pages/client/ViewHistory';
import Comparison from './pages/client/Comparison';

// Seller Pages
import SellerDashboard from './components/seller/SellerDashboard';
import ManageProperties from './pages/seller/ManageProperties';
import ManageInquiries from './pages/seller/ManageInquiries';
import ManageAppointments from './pages/seller/ManageAppointments';
import SellerAnalytics from './pages/seller/Analytics';
import SellerMessages from './pages/seller/Messages';
import SellerReviews from './pages/seller/Reviews';
import Subscriptions from './pages/seller/Subscriptions';
import Referrals from './pages/seller/Referrals';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminProperties from './pages/admin/Properties';
import AdminReports from './pages/admin/Reports';
import AdminSystem from './pages/admin/System';

// Common
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import InviteLink from './pages/InviteLink';
import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="features" element={<Features />} />
          <Route path="invite/:code" element={<InviteLink />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Dashboard - Redirects to role-specific dashboard */}
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* AI Routes */}
          <Route path="price-prediction" element={<PricePrediction />} />
          <Route path="market-analytics" element={<MarketAnalytics />} />
          <Route path="recommendations" element={<PrivateRoute><PropertyRecommendations /></PrivateRoute>} />
          
          {/* Client Routes - Only for 'user' role */}
          <Route path="client">
            <Route path="dashboard" element={<RoleBasedRoute allowedRoles={['user']}><ClientDashboard /></RoleBasedRoute>} />
            <Route path="favorites" element={<RoleBasedRoute allowedRoles={['user']}><ClientFavorites /></RoleBasedRoute>} />
            <Route path="inquiries" element={<RoleBasedRoute allowedRoles={['user']}><ClientInquiries /></RoleBasedRoute>} />
            <Route path="appointments" element={<RoleBasedRoute allowedRoles={['user']}><ClientAppointments /></RoleBasedRoute>} />
            <Route path="messages" element={<RoleBasedRoute allowedRoles={['user']}><ClientMessages /></RoleBasedRoute>} />
            <Route path="saved-searches" element={<RoleBasedRoute allowedRoles={['user']}><SavedSearches /></RoleBasedRoute>} />
            <Route path="view-history" element={<RoleBasedRoute allowedRoles={['user']}><ViewHistory /></RoleBasedRoute>} />
            <Route path="comparison" element={<RoleBasedRoute allowedRoles={['user']}><Comparison /></RoleBasedRoute>} />
          </Route>

          {/* Seller Routes - Only for 'agent' role */}
          <Route path="seller">
            <Route path="dashboard" element={<RoleBasedRoute allowedRoles={['agent']}><SellerDashboard /></RoleBasedRoute>} />
            <Route path="properties" element={<RoleBasedRoute allowedRoles={['agent']}><ManageProperties /></RoleBasedRoute>} />
            <Route path="inquiries" element={<RoleBasedRoute allowedRoles={['agent']}><ManageInquiries /></RoleBasedRoute>} />
            <Route path="appointments" element={<RoleBasedRoute allowedRoles={['agent']}><ManageAppointments /></RoleBasedRoute>} />
            <Route path="analytics" element={<RoleBasedRoute allowedRoles={['agent']}><SellerAnalytics /></RoleBasedRoute>} />
            <Route path="messages" element={<RoleBasedRoute allowedRoles={['agent']}><SellerMessages /></RoleBasedRoute>} />
            <Route path="reviews" element={<RoleBasedRoute allowedRoles={['agent']}><SellerReviews /></RoleBasedRoute>} />
            <Route path="subscriptions" element={<RoleBasedRoute allowedRoles={['agent']}><Subscriptions /></RoleBasedRoute>} />
            <Route path="referrals" element={<RoleBasedRoute allowedRoles={['agent']}><Referrals /></RoleBasedRoute>} />
          </Route>

          {/* Admin Routes - Only for 'admin' role */}
          <Route path="admin">
            <Route path="dashboard" element={<RoleBasedRoute allowedRoles={['admin']}><AdminDashboard /></RoleBasedRoute>} />
            <Route path="users" element={<RoleBasedRoute allowedRoles={['admin']}><AdminUsers /></RoleBasedRoute>} />
            <Route path="properties" element={<RoleBasedRoute allowedRoles={['admin']}><AdminProperties /></RoleBasedRoute>} />
            <Route path="reports" element={<RoleBasedRoute allowedRoles={['admin']}><AdminReports /></RoleBasedRoute>} />
            <Route path="system" element={<RoleBasedRoute allowedRoles={['admin']}><AdminSystem /></RoleBasedRoute>} />
          </Route>
          
          {/* Common Protected Routes */}
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="add-property" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
          <Route path="edit-property/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      {/* Global Components */}
      <ChatBot />
    </>
  );
}

export default App;