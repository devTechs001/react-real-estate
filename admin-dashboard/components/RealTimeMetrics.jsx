import React from 'react';

const RealTimeMetrics = () => {
  // Mock data for real-time metrics
  const metrics = {
    usersOnline: 42,
    activeListings: 128,
    inquiriesPerMinute: 3,
    systemHealth: 'healthy',
    totalUsers: 1245,
    newUsersToday: 8,
    activeDeals: 24
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Users Online</h4>
        <p className="text-2xl font-bold text-blue-600">{metrics.usersOnline}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Active Listings</h4>
        <p className="text-2xl font-bold text-green-600">{metrics.activeListings}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Inquiries/Min</h4>
        <p className="text-2xl font-bold text-yellow-600">{metrics.inquiriesPerMinute}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">System Health</h4>
        <p className={`text-2xl font-bold ${metrics.systemHealth === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
          {metrics.systemHealth}
        </p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
        <p className="text-2xl font-bold text-purple-600">{metrics.totalUsers}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">New Today</h4>
        <p className="text-2xl font-bold text-indigo-600">{metrics.newUsersToday}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Active Deals</h4>
        <p className="text-2xl font-bold text-teal-600">{metrics.activeDeals}</p>
      </div>
    </div>
  );
};

export default RealTimeMetrics;