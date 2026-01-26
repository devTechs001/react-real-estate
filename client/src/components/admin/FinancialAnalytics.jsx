import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
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

const FinancialAnalytics = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // Last 30 days by default

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);

  const fetchFinancialData = async () => {
    try {
      const params = {};
      if (timeRange) {
        // Convert time range to date parameters if needed
        const now = new Date();
        let startDate = new Date();

        if (timeRange === '7') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === '30') {
          startDate.setDate(now.getDate() - 30);
        } else if (timeRange === '90') {
          startDate.setDate(now.getDate() - 90);
        } else if (timeRange === '365') {
          startDate.setDate(now.getDate() - 365);
        }

        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = now.toISOString().split('T')[0];
      }

      const data = await dashboardService.getFinancialAnalytics(params);
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  // Chart data configurations
  const revenueTrendData = {
    labels: financialData?.monthlyTrend?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: financialData?.monthlyTrend?.map(item => item.revenue) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Expenses',
        data: financialData?.monthlyTrend?.map(item => item.expenses) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
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
        text: 'Monthly Revenue vs Expenses Trend',
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

  const revenueBySourceData = {
    labels: financialData?.revenueBySource?.map(item => item.source) || [],
    datasets: [
      {
        label: 'Amount ($)',
        data: financialData?.revenueBySource?.map(item => item.amount) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const revenueBySourceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue by Source',
      },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Financial Analytics</h2>
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
          <p className="text-2xl font-bold">${financialData?.revenue.total?.toLocaleString()}</p>
          <p className="text-xs opacity-80">↑ {financialData?.revenue.growthRate}% from last period</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Total Profit</h3>
          <p className="text-2xl font-bold">${financialData?.profit.total?.toLocaleString()}</p>
          <p className="text-xs opacity-80">Margin: {financialData?.profit.margin}%</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Commissions</h3>
          <p className="text-2xl font-bold">${financialData?.commissions.total?.toLocaleString()}</p>
          <p className="text-xs opacity-80">@ {financialData?.commissions.rate}% rate</p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <h3 className="text-sm font-medium">Transactions</h3>
          <p className="text-2xl font-bold">{financialData?.transactions.total}</p>
          <p className="text-xs opacity-80">Success: {financialData?.transactions.successful}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Line data={revenueTrendData} options={revenueTrendOptions} />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <Pie data={revenueBySourceData} options={revenueBySourceOptions} />
        </div>
      </div>

      {/* Detailed Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">Revenue Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Property Sales:</span>
              <span className="font-medium">${financialData?.revenueBySource?.[0]?.amount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Subscriptions:</span>
              <span className="font-medium">${financialData?.revenueBySource?.[1]?.amount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium Features:</span>
              <span className="font-medium">${financialData?.revenueBySource?.[2]?.amount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">Expenses</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Platform:</span>
              <span className="font-medium">${financialData?.expenses.platform?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing:</span>
              <span className="font-medium">${financialData?.expenses.marketing?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">${financialData?.expenses.total?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">Transaction Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Successful:</span>
              <span className="font-medium">{financialData?.transactions.successful || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Failed:</span>
              <span className="font-medium">{financialData?.transactions.failed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Value:</span>
              <span className="font-medium">${financialData?.transactions.averageValue?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;