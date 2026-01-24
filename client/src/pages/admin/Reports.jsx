import { useState, useEffect } from 'react';
import { FaDownload, FaFileExport, FaChartBar, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/reports?range=${dateRange}`);
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const { data } = await api.get(`/admin/reports/export?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) return <Loader fullScreen />;

  const propertyStatsData = {
    labels: reports?.propertyStats?.map((s) => s.month) || [],
    datasets: [
      {
        label: 'Properties Listed',
        data: reports?.propertyStats?.map((s) => s.count) || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const userActivityData = {
    labels: ['Active', 'Inactive', 'New'],
    datasets: [
      {
        data: [
          reports?.userActivity?.active || 0,
          reports?.userActivity?.inactive || 0,
          reports?.userActivity?.new || 0,
        ],
        backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
      },
    ],
  };

  const revenueData = {
    labels: reports?.revenue?.map((r) => r.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: reports?.revenue?.map((r) => r.amount) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">View detailed system reports</p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>

          <button onClick={() => handleExport('pdf')} className="btn btn-primary">
            <FaDownload className="mr-2" />
            Export PDF
          </button>
          <button onClick={() => handleExport('csv')} className="btn btn-outline">
            <FaFileExport className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `$${reports?.totalRevenue?.toLocaleString() || 0}`, color: 'green' },
          { label: 'Total Properties', value: reports?.totalProperties || 0, color: 'blue' },
          { label: 'Active Users', value: reports?.activeUsers || 0, color: 'purple' },
          { label: 'Transactions', value: reports?.transactions || 0, color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <p className="text-gray-600 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Property Listings Trend</h3>
          <Line data={propertyStatsData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">User Activity</h3>
          <Pie data={userActivityData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
          <Bar data={revenueData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
