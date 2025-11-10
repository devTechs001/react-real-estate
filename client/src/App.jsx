import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/common/SplashScreen';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/common/PrivateRoute';
import ChatBot from './components/ai/ChatBot';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// AI Pages
import PricePrediction from './components/ai/PricePrediction';
import MarketAnalytics from './components/ai/MarketAnalytics';
import PropertyRecommendations from './components/ai/PropertyRecommendations';

// Client Pages
import ClientDashboard from './components/client/ClientDashboard';
import ClientFavorites from './pages/client/Favorites';
import ClientInquiries from './pages/client/MyInquiries';
import ClientAppointments from './pages/client/MyAppointments';
import ClientMessages from './pages/client/Messages';

// Seller Pages
import SellerDashboard from './components/seller/SellerDashboard';
import ManageProperties from './pages/seller/ManageProperties';
import ManageInquiries from './pages/seller/ManageInquiries';
import ManageAppointments from './pages/seller/ManageAppointments';
import SellerAnalytics from './pages/seller/Analytics';
import SellerMessages from './pages/seller/Messages';

// Common
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
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
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* AI Routes */}
          <Route path="price-prediction" element={<PricePrediction />} />
          <Route path="market-analytics" element={<MarketAnalytics />} />
          <Route path="recommendations" element={<PrivateRoute><PropertyRecommendations /></PrivateRoute>} />
          
          {/* Client Routes */}
          <Route path="client">
            <Route path="dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
            <Route path="favorites" element={<PrivateRoute><ClientFavorites /></PrivateRoute>} />
            <Route path="inquiries" element={<PrivateRoute><ClientInquiries /></PrivateRoute>} />
            <Route path="appointments" element={<PrivateRoute><ClientAppointments /></PrivateRoute>} />
            <Route path="messages" element={<PrivateRoute><ClientMessages /></PrivateRoute>} />
          </Route>
          
          {/* Seller Routes */}
          <Route path="seller">
            <Route path="dashboard" element={<PrivateRoute><SellerDashboard /></PrivateRoute>} />
            <Route path="properties" element={<PrivateRoute><ManageProperties /></PrivateRoute>} />
            <Route path="inquiries" element={<PrivateRoute><ManageInquiries /></PrivateRoute>} />
            <Route path="appointments" element={<PrivateRoute><ManageAppointments /></PrivateRoute>} />
            <Route path="analytics" element={<PrivateRoute><SellerAnalytics /></PrivateRoute>} />
            <Route path="messages" element={<PrivateRoute><SellerMessages /></PrivateRoute>} />
          </Route>
          
          {/* Common Protected Routes */}
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
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