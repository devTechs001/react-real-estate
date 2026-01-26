import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChatBot from './components/ai/Chatbot';
import AISecurityWrapper from './components/AISecurityWrapper';
import AIAssistant from './components/ai/AIAssistant';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import SellerLayout from './components/layouts/SellerLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Lazy load pages
const Splash = lazy(() => import('./components/common/SplashScreen'));
const Home = lazy(() => import('./pages/Home'));
const Features = lazy(() => import('./pages/Features'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PricePrediction = lazy(() => import('./components/ai/PricePrediction'));

// User Dashboard Pages (content only, no layout)
const DashboardHome = lazy(() => import('./pages/user/DashboardHome'));
const Favorites = lazy(() => import('./pages/client/Favorites'));
const Inquiries = lazy(() => import('./pages/client/MyInquiries'));
const Appointments = lazy(() => import('./pages/client/MyAppointments'));
const SavedSearches = lazy(() => import('./pages/client/SavedSearches'));
const Notifications = lazy(() => import('./components/client/Notifications'));
const Profile = lazy(() => import('./components/client/Profile'));
const Settings = lazy(() => import('./components/client/Settings'));

// Seller Dashboard Pages (content only, no layout)
const SellerOverview = lazy(() => import('./pages/seller/SellerOverview'));
const SellerProperties = lazy(() => import('./components/seller/SellerProperties'));
const AddProperty = lazy(() => import('./components/seller/AddProperty'));
const SellerInquiries = lazy(() => import('./pages/seller/ManageInquiries'));
const SellerAppointments = lazy(() => import('./pages/seller/ManageAppointments'));
const Analytics = lazy(() => import('./pages/seller/Analytics'));
const Leads = lazy(() => import('./components/seller/LeadManagement'));
const Subscriptions = lazy(() => import('./pages/seller/Subscriptions'));

// Admin Dashboard Pages (content only, no layout)
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminApprovals = lazy(() => import('./components/admin/PropertyModeration'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminReported = lazy(() => import('./components/admin/ReportManagement'));
const AdminAnalytics = lazy(() => import('./components/admin/SystemAnalytics'));
const AdminSettings = lazy(() => import('./components/admin/SystemSettings'));
const SystemHealth = lazy(() => import('./components/admin/SystemHealth'));
const SystemLogs = lazy(() => import('./components/admin/SystemLogs'));
const EmailTemplates = lazy(() => import('./components/admin/EmailTemplates'));
const FinancialAnalytics = lazy(() => import('./components/admin/FinancialAnalytics'));
const SellerPerformance = lazy(() => import('./components/admin/SellerPerformance'));

function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* ============ PUBLIC ROUTES ============ */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/price-prediction" element={<PricePrediction />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>

        {/* ============ USER DASHBOARD ROUTES ============ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/saved-searches" element={<SavedSearches />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ============ SELLER DASHBOARD ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerOverview />} />
            <Route path="/seller/properties" element={<SellerProperties />} />
            <Route path="/seller/properties/new" element={<AddProperty />} />
            <Route path="/seller/properties/:id/edit" element={<AddProperty />} />
            <Route path="/seller/inquiries" element={<SellerInquiries />} />
            <Route path="/seller/appointments" element={<SellerAppointments />} />
            <Route path="/seller/analytics" element={<Analytics />} />
            <Route path="/seller/leads" element={<Leads />} />
            <Route path="/seller/subscriptions" element={<Subscriptions />} />
          </Route>
        </Route>

        {/* ============ ADMIN DASHBOARD ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reported" element={<AdminReported />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/system" element={<SystemHealth />} />
            <Route path="/admin/logs" element={<SystemLogs />} />
            <Route path="/admin/emails" element={<EmailTemplates />} />
            <Route path="/admin/financial-analytics" element={<FinancialAnalytics />} />
            <Route path="/admin/seller-performance" element={<SellerPerformance />} />
          </Route>
        </Route>

        {/* ============ FALLBACK ============ */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363632',
            color: '#fff',
          },
        }}
      />

      {/* Floating ChatBot */}
      <ChatBot />

      {/* AI Assistant for public routes */}
      <AIAssistant />
    </Suspense>
  );
}

export default App;