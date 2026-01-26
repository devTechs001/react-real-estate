// client/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 8543,
    totalProperties: 15420,
    totalRevenue: 125000,
    activeListings: 12350,
    pendingApprovals: 45,
    reportedContent: 12
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);

  const navItems = [
    { path: '/admin', label: 'Overview', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/properties', label: 'Properties', icon: '🏠' },
    { path: '/admin/transactions', label: 'Transactions', icon: '💳' },
    { path: '/admin/reports', label: 'Reports', icon: '📋' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    setRecentUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active', joined: '2024-01-15' },
      { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'seller', status: 'active', joined: '2024-01-14' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'buyer', status: 'pending', joined: '2024-01-13' },
    ]);

    setRecentProperties([
      { id: 1, title: 'Luxury Villa', seller: 'Jane Doe', price: 2500000, status: 'pending', date: '2024-01-15' },
      { id: 2, title: 'Downtown Apartment', seller: 'Bob Smith', price: 450000, status: 'active', date: '2024-01-14' },
      { id: 3, title: 'Beach House', seller: 'Alice Brown', price: 1200000, status: 'pending', date: '2024-01-13' },
    ]);
  }, []);

  return (
    <>
      <SEO title="Admin Dashboard - HomeScape" description="Admin control panel" />

      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white fixed h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold">HomeScape</span>
                <span className="block text-xs text-gray-400">Admin Panel</span>
              </div>
            </Link>
          </div>

          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">admin@homescape.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, Admin</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <span className="text-xl">🔔</span>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥', color: 'blue' },
                { label: 'Properties', value: stats.totalProperties.toLocaleString(), icon: '🏠', color: 'green' },
                { label: 'Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: '💰', color: 'purple' },
                { label: 'Active Listings', value: stats.activeListings.toLocaleString(), icon: '✅', color: 'teal' },
                { label: 'Pending Approval', value: stats.pendingApprovals, icon: '⏳', color: 'orange' },
                { label: 'Reported', value: stats.reportedContent, icon: '⚠️', color: 'red' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">Recent Users</h2>
                  <Link to="/admin/users" className="text-blue-600 text-sm hover:underline">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Properties */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">Properties Pending Approval</h2>
                  <Link to="/admin/properties" className="text-blue-600 text-sm hover:underline">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentProperties.map((property) => (
                    <div key={property.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-500">by {property.seller}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${property.price.toLocaleString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Manage Users', icon: '👥', link: '/admin/users', color: 'blue' },
                { label: 'Review Properties', icon: '🏠', link: '/admin/properties', color: 'green' },
                { label: 'View Reports', icon: '📋', link: '/admin/reports', color: 'orange' },
                { label: 'System Settings', icon: '⚙️', link: '/admin/settings', color: 'purple' },
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-4xl block mb-2">{action.icon}</span>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;