// client/src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUsers([
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        role: 'user',
        status: 'active',
        verified: true,
        twoFactorEnabled: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-01-18T15:30:00Z',
        properties: 0,
        inquiries: 12,
        favorites: 8,
        subscription: null,
        location: 'New York, NY'
      },
      {
        id: 2,
        name: 'Sarah Mitchell',
        email: 'sarah@example.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        role: 'seller',
        status: 'active',
        verified: true,
        twoFactorEnabled: false,
        createdAt: '2024-01-10T08:00:00Z',
        lastLogin: '2024-01-18T14:00:00Z',
        properties: 15,
        inquiries: 45,
        favorites: 3,
        subscription: { plan: 'Professional', status: 'active', expiresAt: '2024-12-31' },
        location: 'Miami, FL'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 345-6789',
        avatar: null,
        role: 'seller',
        status: 'suspended',
        verified: true,
        twoFactorEnabled: false,
        createdAt: '2023-12-01T12:00:00Z',
        lastLogin: '2024-01-15T09:00:00Z',
        properties: 5,
        inquiries: 8,
        favorites: 0,
        subscription: { plan: 'Basic', status: 'suspended', expiresAt: '2024-06-30' },
        location: 'Los Angeles, CA',
        suspensionReason: 'Multiple reports of fraudulent listings'
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        role: 'admin',
        status: 'active',
        verified: true,
        twoFactorEnabled: true,
        createdAt: '2023-06-15T09:00:00Z',
        lastLogin: '2024-01-18T16:00:00Z',
        properties: 0,
        inquiries: 0,
        favorites: 0,
        subscription: null,
        location: 'Chicago, IL'
      },
      {
        id: 5,
        name: 'Robert Wilson',
        email: 'robert@example.com',
        phone: '+1 (555) 567-8901',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        role: 'user',
        status: 'pending',
        verified: false,
        twoFactorEnabled: false,
        createdAt: '2024-01-18T12:00:00Z',
        lastLogin: null,
        properties: 0,
        inquiries: 0,
        favorites: 0,
        subscription: null,
        location: 'Boston, MA'
      },
      {
        id: 6,
        name: 'Lisa Thompson',
        email: 'lisa@example.com',
        phone: '+1 (555) 678-9012',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        role: 'seller',
        status: 'active',
        verified: true,
        twoFactorEnabled: true,
        createdAt: '2023-09-20T14:00:00Z',
        lastLogin: '2024-01-18T10:00:00Z',
        properties: 28,
        inquiries: 156,
        favorites: 12,
        subscription: { plan: 'Enterprise', status: 'active', expiresAt: '2025-09-20' },
        location: 'San Francisco, CA'
      },
      {
        id: 7,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1 (555) 789-0123',
        avatar: null,
        role: 'user',
        status: 'banned',
        verified: true,
        twoFactorEnabled: false,
        createdAt: '2023-11-05T11:00:00Z',
        lastLogin: '2024-01-10T08:00:00Z',
        properties: 0,
        inquiries: 3,
        favorites: 1,
        subscription: null,
        location: 'Seattle, WA',
        banReason: 'Harassment and threatening behavior towards sellers'
      },
      {
        id: 8,
        name: 'Jennifer Garcia',
        email: 'jennifer@example.com',
        phone: '+1 (555) 890-1234',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        role: 'seller',
        status: 'active',
        verified: true,
        twoFactorEnabled: false,
        createdAt: '2024-01-05T16:00:00Z',
        lastLogin: '2024-01-18T11:30:00Z',
        properties: 8,
        inquiries: 34,
        favorites: 5,
        subscription: { plan: 'Professional', status: 'active', expiresAt: '2025-01-05' },
        location: 'Denver, CO'
      }
    ]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      banned: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[status] || styles.pending;
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-500/20 text-purple-400',
      seller: 'bg-blue-500/20 text-blue-400',
      user: 'bg-slate-500/20 text-slate-400'
    };
    return styles[role] || styles.user;
  };

  const updateUserStatus = async (id, newStatus) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    
    setActionLoading(null);
    toast.success(`User ${newStatus === 'active' ? 'activated' : newStatus}`);
    
    if (showDetailsModal) {
      setShowDetailsModal(false);
      setSelectedUser(null);
    }
  };

  const banUser = async () => {
    if (!selectedUser || !banReason.trim()) return;
    
    setActionLoading(selectedUser.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id 
        ? { ...user, status: 'banned', banReason } 
        : user
    ));
    
    setActionLoading(null);
    setShowBanModal(false);
    setSelectedUser(null);
    setBanReason('');
    toast.success('User has been banned');
  };

  const updateUserRole = async (id, newRole) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
    
    setActionLoading(null);
    toast.success(`User role updated to ${newRole}`);
  };

  const verifyUser = async (id) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, verified: true, status: 'active' } : user
    ));
    
    setActionLoading(null);
    toast.success('User verified successfully');
  };

  const sendPasswordReset = async (email) => {
    toast.loading('Sending reset link...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.dismiss();
    toast.success(`Password reset link sent to ${email}`);
  };

  // Filtering & Sorting
  const filteredUsers = users
    .filter(user => {
      const matchesStatus = filter === 'all' || user.status === filter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesRole && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'properties':
          return b.properties - a.properties;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    sellers: users.filter(u => u.role === 'seller').length,
    pending: users.filter(u => u.status === 'pending').length,
    banned: users.filter(u => u.status === 'banned').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <SEO title="Users - Admin Dashboard" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage and monitor user accounts</p>
        </div>
        <button
          onClick={() => toast.success('Export started')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Users
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Users', value: stats.total, icon: '👥', color: 'blue' },
          { label: 'Active', value: stats.active, icon: '✅', color: 'green' },
          { label: 'Sellers', value: stats.sellers, icon: '🏠', color: 'purple' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'yellow' },
          { label: 'Banned', value: stats.banned, icon: '🚫', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users by name, email, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="properties">Most Properties</option>
          </select>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'pending', 'suspended', 'banned'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/4" />
                  <div className="h-3 bg-slate-700 rounded w-1/3" />
                </div>
                <div className="h-8 bg-slate-700 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-2xl">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
          <p className="text-slate-400">
            {searchTerm || filter !== 'all' || roleFilter !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'No users have registered yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-slate-800 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-700/50 text-sm font-medium text-slate-400">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-700">
              <AnimatePresence>
                {paginatedUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-700/30 transition-colors"
                  >
                    {/* User Info */}
                    <div className="col-span-4 flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          {user.name}
                          {user.verified && (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {user.twoFactorEnabled && (
                            <span className="text-green-400 text-xs">🔐</span>
                          )}
                        </p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                        <p className="text-slate-500 text-xs md:hidden mt-1">{user.location}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                      {user.subscription && (
                        <p className="text-xs text-slate-500 mt-1">{user.subscription.plan}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize border ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </div>

                    {/* Joined */}
                    <div className="col-span-2 text-slate-400 text-sm">
                      <p>{formatDate(user.createdAt)}</p>
                      <p className="text-xs text-slate-500">
                        Last: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {user.status === 'pending' && (
                        <button
                          onClick={() => verifyUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          title="Verify User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      
                      {user.status === 'active' && user.role !== 'admin' && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBanModal(true);
                          }}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Ban User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      )}
                      
                      {(user.status === 'banned' || user.status === 'suspended') && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          disabled={actionLoading === user.id}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          title="Restore User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-slate-400 text-sm">
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedUser(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">User Details</h2>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedUser(null);
                    }}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* User Profile */}
                <div className="flex items-center gap-4">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(selectedUser.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.verified && (
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-slate-400">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${getRoleBadge(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs capitalize border ${getStatusBadge(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">Phone</p>
                    <p className="text-white">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">Location</p>
                    <p className="text-white">{selectedUser.location || 'Not provided'}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedUser.properties}</p>
                    <p className="text-slate-400 text-sm">Properties</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedUser.inquiries}</p>
                    <p className="text-slate-400 text-sm">Inquiries</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedUser.favorites}</p>
                    <p className="text-slate-400 text-sm">Favorites</p>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <h4 className="text-white font-medium mb-3">Account Information</h4>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Joined</span>
                    <span className="text-white">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Login</span>
                    <span className="text-white">
                      {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Verified</span>
                    <span className={selectedUser.verified ? 'text-green-400' : 'text-red-400'}>
                      {selectedUser.verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">2FA Enabled</span>
                    <span className={selectedUser.twoFactorEnabled ? 'text-green-400' : 'text-slate-400'}>
                      {selectedUser.twoFactorEnabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Subscription */}
                {selectedUser.subscription && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-medium mb-3">Subscription</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Plan</p>
                        <p className="text-white font-medium">{selectedUser.subscription.plan}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Status</p>
                        <p className={`capitalize ${
                          selectedUser.subscription.status === 'active' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {selectedUser.subscription.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Expires</p>
                        <p className="text-white">{formatDate(selectedUser.subscription.expiresAt)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ban/Suspension Reason */}
                {(selectedUser.banReason || selectedUser.suspensionReason) && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h4 className="text-red-400 font-medium mb-2">
                      {selectedUser.status === 'banned' ? 'Ban Reason' : 'Suspension Reason'}
                    </h4>
                    <p className="text-slate-300">
                      {selectedUser.banReason || selectedUser.suspensionReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                  {/* Role Change */}
                  {selectedUser.role !== 'admin' && (
                    <select
                      value={selectedUser.role}
                      onChange={(e) => updateUserRole(selectedUser.id, e.target.value)}
                      disabled={actionLoading === selectedUser.id}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}

                  <button
                    onClick={() => sendPasswordReset(selectedUser.email)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Send Password Reset
                  </button>

                  {selectedUser.status === 'active' && selectedUser.role !== 'admin' && (
                    <>
                      <button
                        onClick={() => updateUserStatus(selectedUser.id, 'suspended')}
                        disabled={actionLoading === selectedUser.id}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors disabled:opacity-50"
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setShowBanModal(true);
                        }}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                      >
                        Ban User
                      </button>
                    </>
                  )}

                  {(selectedUser.status === 'banned' || selectedUser.status === 'suspended') && (
                    <button
                      onClick={() => updateUserStatus(selectedUser.id, 'active')}
                      disabled={actionLoading === selectedUser.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Restore User
                    </button>
                  )}

                  {!selectedUser.verified && (
                    <button
                      onClick={() => verifyUser(selectedUser.id)}
                      disabled={actionLoading === selectedUser.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Verify Email
                    </button>
                  )}

                  <Link
                    to={`/admin/users/${selectedUser.id}/activity`}
                    className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    View Activity Log
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ban User Modal */}
      <AnimatePresence>
        {showBanModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowBanModal(false);
              setSelectedUser(null);
              setBanReason('');
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ban User?</h3>
                <p className="text-slate-400">
                  You are about to ban <span className="text-white font-medium">{selectedUser.name}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Ban Reason *
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Provide a reason for banning this user..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason('');
                  }}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={banUser}
                  disabled={!banReason.trim() || actionLoading === selectedUser.id}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading === selectedUser.id ? 'Banning...' : 'Ban User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminUsers;