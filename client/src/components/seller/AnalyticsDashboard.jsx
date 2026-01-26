// client/src/pages/seller/Analytics.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');

  const stats = {
    totalViews: 15420,
    totalInquiries: 156,
    totalFavorites: 312,
    avgResponseTime: '2.3 hours',
    conversionRate: 14.8,
    viewsChange: 12.5,
    inquiriesChange: 8.2
  };

  const propertyStats = [
    { id: 1, title: 'Luxury Waterfront Villa', views: 2450, inquiries: 32, favorites: 89, tours: 12, ctr: 1.3 },
    { id: 2, title: 'Modern Downtown Penthouse', views: 1890, inquiries: 28, favorites: 67, tours: 8, ctr: 1.5 },
    { id: 3, title: 'Cozy Mountain Cabin', views: 1560, inquiries: 21, favorites: 54, tours: 6, ctr: 1.3 },
    { id: 4, title: 'Beach House Paradise', views: 1230, inquiries: 18, favorites: 43, tours: 5, ctr: 1.5 },
    { id: 5, title: 'Urban Loft Living', views: 980, inquiries: 14, favorites: 38, tours: 4, ctr: 1.4 },
  ];

  const trafficSources = [
    { source: 'Direct Search', percentage: 45, color: 'bg-blue-500' },
    { source: 'Google', percentage: 25, color: 'bg-green-500' },
    { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
    { source: 'Referral', percentage: 10, color: 'bg-orange-500' },
    { source: 'Other', percentage: 5, color: 'bg-gray-500' },
  ];

  return (
    <>
      <SEO title="Analytics - HomeScape Seller" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your property performance</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: '7days', label: '7 Days' },
            { value: '30days', label: '30 Days' },
            { value: '90days', label: '90 Days' },
            { value: 'year', label: 'This Year' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-2 rounded-xl text-sm ${
                dateRange === range.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Views', value: stats.totalViews.toLocaleString(), change: stats.viewsChange, icon: '👁️' },
          { label: 'Inquiries', value: stats.totalInquiries, change: stats.inquiriesChange, icon: '💬' },
          { label: 'Favorites', value: stats.totalFavorites, change: 5.4, icon: '❤️' },
          { label: 'Scheduled Tours', value: 35, change: 12.0, icon: '📅' },
          { label: 'Avg Response', value: stats.avgResponseTime, icon: '⏱️' },
          { label: 'Conversion', value: `${stats.conversionRate}%`, change: 2.1, icon: '📈' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              {stat.change && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Views Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Views & Inquiries Trend</h3>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-2">📈</span>
              <p>Line Chart Visualization</p>
              <p className="text-sm">Integrate with Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{source.source}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.color} rounded-full`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Property Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inquiries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Favorites</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {propertyStats.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{property.title}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{property.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{property.inquiries}</td>
                  <td className="px-6 py-4 text-gray-600">{property.favorites}</td>
                  <td className="px-6 py-4 text-gray-600">{property.tours}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.ctr >= 1.4 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {property.ctr}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-2xl p-6">
          <h4 className="font-semibold text-green-900 mb-2">📈 Top Performer</h4>
          <p className="text-green-800 text-sm">
            "Luxury Waterfront Villa" has the highest engagement with 2,450 views this month.
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendation</h4>
          <p className="text-blue-800 text-sm">
            Add virtual tours to properties to increase inquiry rate by up to 40%.
          </p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-6">
          <h4 className="font-semibold text-orange-900 mb-2">⚡ Action Needed</h4>
          <p className="text-orange-800 text-sm">
            "Urban Loft Living" has lower than average views. Consider updating photos.
          </p>
        </div>
      </div>
    </>
  );
};

export default Analytics;