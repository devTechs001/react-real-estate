// client/src/pages/seller/Analytics.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SEO from '../../components/common/SEO';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [stats, setStats] = useState({
    totalViews: 15420,
    totalInquiries: 156,
    avgResponseTime: '2.3 hours',
    conversionRate: 14.8,
    viewsChange: 12.5,
    inquiriesChange: 8.2
  });
  const [propertyStats, setPropertyStats] = useState([]);

  useEffect(() => {
    setPropertyStats([
      { id: 1, title: 'Luxury Waterfront Villa', views: 2450, inquiries: 32, favorites: 89, tours: 12, status: 'active' },
      { id: 2, title: 'Modern Downtown Penthouse', views: 1890, inquiries: 28, favorites: 67, tours: 8, status: 'active' },
      { id: 3, title: 'Cozy Mountain Cabin', views: 1560, inquiries: 21, favorites: 54, tours: 6, status: 'active' },
      { id: 4, title: 'Beach House Paradise', views: 1230, inquiries: 18, favorites: 43, tours: 5, status: 'pending' },
      { id: 5, title: 'Urban Loft Living', views: 980, inquiries: 14, favorites: 38, tours: 4, status: 'active' },
    ]);
  }, [dateRange]);

  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <>
      <SEO title="Analytics - HomeScape Seller" description="View your property analytics" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Track your property performance</p>
              </div>
              <div className="flex gap-2">
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setDateRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      dateRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: 'Total Views', 
                  value: stats.totalViews.toLocaleString(), 
                  change: stats.viewsChange,
                  icon: '👁️' 
                },
                { 
                  label: 'Total Inquiries', 
                  value: stats.totalInquiries, 
                  change: stats.inquiriesChange,
                  icon: '💬' 
                },
                { 
                  label: 'Avg Response Time', 
                  value: stats.avgResponseTime, 
                  icon: '⏱️' 
                },
                { 
                  label: 'Conversion Rate', 
                  value: `${stats.conversionRate}%`, 
                  icon: '📈' 
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    {stat.change && (
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Views Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Views Over Time</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <span className="text-4xl block mb-2">📈</span>
                    <p>Line Chart - Views Trend</p>
                  </div>
                </div>
              </div>

              {/* Inquiries Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Inquiries by Source</h3>
                <div className="h-64 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <span className="text-4xl block mb-2">🥧</span>
                    <p>Pie Chart - Source Distribution</p>
                  </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inquiries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Favorites
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {propertyStats.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{property.title}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {property.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {property.inquiries}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {property.favorites}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {property.tours}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            property.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {property.status}
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
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Top Insight</h4>
                <p className="text-blue-800 text-sm">
                  Properties with 10+ photos receive 3x more inquiries. Consider adding more images to your listings.
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-semibold text-green-900 mb-2">📈 Trending Up</h4>
                <p className="text-green-800 text-sm">
                  Your "Luxury Waterfront Villa" listing views increased by 45% this week.
                </p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6">
                <h4 className="font-semibold text-orange-900 mb-2">⚡ Action Needed</h4>
                <p className="text-orange-800 text-sm">
                  3 inquiries are awaiting response for more than 24 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Analytics;