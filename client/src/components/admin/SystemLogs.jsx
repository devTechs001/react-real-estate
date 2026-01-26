import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    level: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSystemLogs();
  }, [pagination.currentPage, filters]);

  const fetchSystemLogs = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        level: filters.level || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };
      
      const data = await dashboardService.getSystemLogs(params);
      setLogs(data.logs);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching system logs:', error);
      toast.error('Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      level: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">System Logs</h2>
      
      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.user?.name || log.userId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.resource} ({log.resourceId})
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * 50) + 1} to {Math.min(pagination.currentPage * 50, pagination.total)} of {pagination.total} logs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded ${pagination.currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-200 rounded">
              {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200 text-gray-400' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;