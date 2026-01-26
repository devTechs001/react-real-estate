import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch dashboard stats which now includes financial metrics
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const revenueTrendData = {
    labels: analyticsData?.userGrowth?.map(item => item.month) || [],
    datasets: [
      {
        label: 'New Users',
        data: analyticsData?.userGrowth?.map(item => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      }
    ]
  };

  const propertyTypeData = {
    labels: analyticsData?.propertyByType?.map(item => item.type) || [],
    datasets: [
      {
        label: 'Properties',
        data: analyticsData?.propertyByType?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const revenueTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth Trend',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      }
    }
  };

  const propertyTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Properties by Type',
      },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Platform Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ${analyticsData?.financialMetrics?.totalRevenue?.toLocaleString() || '0'}
          </p>
          <p className="text-xs opacity-80">Est. commissions included</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Profit</h3>
          <p className="text-2xl font-bold">
            ${analyticsData?.financialMetrics?.profit?.toLocaleString() || '0'}
          </p>
          <p className="text-xs opacity-80">After expenses</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Total Properties</h3>
          <p className="text-2xl font-bold">{analyticsData?.totalProperties || 0}</p>
          <p className="text-xs opacity-80">Across all sellers</p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold">{analyticsData?.totalUsers || 0}</p>
          <p className="text-xs opacity-80">Registered on platform</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Line data={revenueTrendData} options={revenueTrendOptions} />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <Pie data={propertyTypeData} options={propertyTypeOptions} />
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Top Performing Agents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData?.topAgents?.slice(0, 5).map((agent, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                    <div className="text-sm text-gray-500">{agent.agentEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.propertiesSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${agent.totalRevenue?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.avgRating ? agent.avgRating.toFixed(1) : 'N/A'} ★
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Status Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Properties by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsData?.propertyByStatus?.map((status, index) => (
            <div key={index} className="border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{status.count}</p>
              <p className="text-sm text-gray-600 capitalize">{status.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-3">Quick Analytics Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a 
            href="/admin/financial-analytics" 
            className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="text-indigo-600 font-medium">Financial Analytics</div>
            <div className="text-sm text-gray-600">Detailed revenue and expense reports</div>
          </a>
          <a 
            href="/admin/seller-performance" 
            className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="text-indigo-600 font-medium">Seller Performance</div>
            <div className="text-sm text-gray-600">Individual seller metrics and rankings</div>
          </a>
          <a 
            href="/admin/reports" 
            className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="text-indigo-600 font-medium">Detailed Reports</div>
            <div className="text-sm text-gray-600">Customizable reports and exports</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;