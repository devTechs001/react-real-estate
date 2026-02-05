import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaShield, 
  FaUser, 
  FaFilter,
  FaDownload,
  FaCheckSquare,
  FaSquare,
  FaEnvelope,
  FaBan,
  FaCheck,
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [filters, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const newStatus = !user.isActive;
      await api.put(`/admin/users/${userId}`, { isActive: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }

    try {
      const endpoint = `/admin/users/bulk-${action}`;
      await api.post(endpoint, { userIds: selectedUsers });
      
      const actionMessages = {
        delete: 'deleted',
        activate: 'activated',
        deactivate: 'deactivated',
        'send-email': 'email sent'
      };

      toast.success(`${selectedUsers.length} users ${actionMessages[action]}`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} users`);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast.error('Please provide subject and message');
      return;
    }

    try {
      await api.post('/admin/users/send-bulk-email', {
        userIds: selectedUsers,
        subject: emailSubject,
        message: emailMessage
      });
      
      toast.success('Email sent successfully');
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailMessage('');
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleExportUsers = async (format) => {
    try {
      const response = await api.get(`/admin/users/export?format=${format}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      
      toast.success(`Users exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export users');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search);
    
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4 flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  {user.name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No users found
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
