import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserSwitchToggle from '../../../../admin-dashboard/components/UserSwitchToggle';
import AdminUserImpersonation from '../../../../admin-dashboard/components/AdminUserImpersonation';
import RealTimeMetrics from '../../../../admin-dashboard/components/RealTimeMetrics';
import UnifiedUserView from '../../../../admin-dashboard/components/UnifiedUserView';
import useUnifiedAnalytics from '../../../../admin-dashboard/hooks/useUnifiedAnalytics';
import useUserActivityMonitor from '../../../../admin-dashboard/hooks/useUserActivityMonitor';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { analytics, loading } = useUnifiedAnalytics();
  const { activeUsers, recentActivities } = useUserActivityMonitor();
  const [timeRange, setTimeRange] = useState('7d');

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your real estate platform</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">User Switch</h3>
          <UserSwitchToggle />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Impersonation</h3>
          <AdminUserImpersonation />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Time Range</h3>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Quick Stats</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Total Users: {analytics.users?.total || 0}</p>
            <p className="text-sm text-gray-600">Active Today: {analytics.users?.newToday || 0}</p>
            <p className="text-sm text-gray-600">Listed Properties: {analytics.properties?.listed || 0}</p>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Metrics</h2>
        <RealTimeMetrics />
      </div>

      {/* Unified User View */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
        <UnifiedUserView />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Users</h3>
          <div className="space-y-3">
            {activeUsers.slice(0, 5).map((user, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>{user.name}</span>
                <span className="text-sm text-gray-500">{user.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="p-2 border-b">
                <p className="text-sm"><strong>{activity.user}</strong> {activity.action} on {activity.property}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;