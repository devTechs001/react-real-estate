// client/src/pages/admin/AdminReports.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setReports([
      {
        id: 1,
        type: 'property',
        reason: 'fraud',
        status: 'pending',
        priority: 'high',
        description: 'This property listing appears to be fraudulent. The price is way below market value and the images seem to be stolen from another listing.',
        reportedItem: {
          id: 101,
          title: 'Suspicious Luxury Villa',
          type: 'property',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
        },
        reportedUser: {
          id: 201,
          name: 'Suspicious Seller',
          email: 'suspicious@example.com',
          avatar: null
        },
        reporter: {
          id: 301,
          name: 'John Smith',
          email: 'john@example.com'
        },
        createdAt: '2024-01-18T10:30:00Z',
        updatedAt: null,
        resolution: null,
        adminNotes: null
      },
      {
        id: 2,
        type: 'user',
        reason: 'harassment',
        status: 'pending',
        priority: 'high',
        description: 'This user has been sending threatening messages to multiple sellers. They demanded refunds and threatened to leave fake reviews.',
        reportedItem: null,
        reportedUser: {
          id: 202,
          name: 'Toxic User',
          email: 'toxic@example.com',
          avatar: null
        },
        reporter: {
          id: 302,
          name: 'Sarah Mitchell',
          email: 'sarah@example.com'
        },
        createdAt: '2024-01-17T15:45:00Z',
        updatedAt: null,
        resolution: null,
        adminNotes: null
      },
      {
        id: 3,
        type: 'review',
        reason: 'fake_review',
        status: 'investigating',
        priority: 'medium',
        description: 'This review appears to be fake. The reviewer has never made any inquiries or appointments for this property.',
        reportedItem: {
          id: 102,
          title: '5-star review for "Beach House"',
          type: 'review',
          content: 'Amazing property! Best purchase ever!',
          rating: 5
        },
        reportedUser: {
          id: 203,
          name: 'Fake Reviewer',
          email: 'fake@example.com',
          avatar: null
        },
        reporter: {
          id: 303,
          name: 'Emily Davis',
          email: 'emily@example.com'
        },
        createdAt: '2024-01-16T09:20:00Z',
        updatedAt: '2024-01-17T11:00:00Z',
        resolution: null,
        adminNotes: 'Checking user activity history'
      },
      {
        id: 4,
        type: 'message',
        reason: 'spam',
        status: 'resolved',
        priority: 'low',
        description: 'User is sending spam messages promoting external websites.',
        reportedItem: {
          id: 103,
          title: 'Spam Message',
          type: 'message',
          content: 'Check out this amazing deal at external-site.com!!!'
        },
        reportedUser: {
          id: 204,
          name: 'Spammer',
          email: 'spam@example.com',
          avatar: null
        },
        reporter: {
          id: 304,
          name: 'Michael Chen',
          email: 'michael@example.com'
        },
        createdAt: '2024-01-15T14:00:00Z',
        updatedAt: '2024-01-15T16:30:00Z',
        resolution: 'User banned and messages deleted',
        adminNotes: 'Permanent ban applied'
      },
      {
        id: 5,
        type: 'property',
        reason: 'misleading',
        status: 'dismissed',
        priority: 'low',
        description: 'The property images do not match the actual property.',
        reportedItem: {
          id: 104,
          title: 'Modern Apartment',
          type: 'property',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
        },
        reportedUser: {
          id: 205,
          name: 'Regular Seller',
          email: 'seller@example.com',
          avatar: null
        },
        reporter: {
          id: 305,
          name: 'Picky Buyer',
          email: 'picky@example.com'
        },
        createdAt: '2024-01-14T11:00:00Z',
        updatedAt: '2024-01-14T14:00:00Z',
        resolution: 'Images verified as authentic. Report dismissed.',
        adminNotes: 'False report - images are genuine professional photos'
      },
      {
        id: 6,
        type: 'user',
        reason: 'impersonation',
        status: 'pending',
        priority: 'critical',
        description: 'This user is impersonating a licensed real estate agent. They are using a stolen license number and photo.',
        reportedItem: null,
        reportedUser: {
          id: 206,
          name: 'Fake Agent',
          email: 'fakeagent@example.com',
          avatar: null
        },
        reporter: {
          id: 306,
          name: 'Real Estate Board',
          email: 'board@realestate.org'
        },
        createdAt: '2024-01-18T08:00:00Z',
        updatedAt: null,
        resolution: null,
        adminNotes: null
      }
    ]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      investigating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      dismissed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[status] || styles.pending;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-yellow-900',
      low: 'bg-slate-500 text-white'
    };
    return styles[priority] || styles.medium;
  };

  const getReasonLabel = (reason) => {
    const labels = {
      fraud: 'Fraud',
      harassment: 'Harassment',
      spam: 'Spam',
      fake_review: 'Fake Review',
      misleading: 'Misleading Content',
      impersonation: 'Impersonation',
      inappropriate: 'Inappropriate Content',
      other: 'Other'
    };
    return labels[reason] || reason;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'property':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'review':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const updateReportStatus = async (id, newStatus) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { 
            ...report, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            resolution: newStatus === 'resolved' ? resolution : report.resolution
          } 
        : report
    ));
    
    setActionLoading(null);
    toast.success(`Report marked as ${newStatus}`);
    
    if (showDetailsModal) {
      setShowDetailsModal(false);
      setSelectedReport(null);
      setResolution('');
    }
  };

  const takeAction = async (report, action) => {
    setActionLoading(report.id);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let message = '';
    switch (action) {
      case 'ban_user':
        message = `User ${report.reportedUser.name} has been banned`;
        break;
      case 'remove_content':
        message = `Content has been removed`;
        break;
      case 'warn_user':
        message = `Warning sent to ${report.reportedUser.name}`;
        break;
      case 'delete_property':
        message = 'Property has been deleted';
        break;
      default:
        message = 'Action completed';
    }
    
    setActionLoading(null);
    toast.success(message);
  };

  // Filtering
  const filteredReports = reports.filter(report => {
    const matchesStatus = filter === 'all' || report.status === filter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesSearch = 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Sort by priority and date
  const sortedReports = [...filteredReports].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Stats
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    critical: reports.filter(r => r.priority === 'critical' && r.status === 'pending').length
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <SEO title="Reports - Admin Dashboard" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Report Management</h1>
          <p className="text-slate-400">Review and resolve user reports</p>
        </div>
        {stats.critical > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl animate-pulse">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{stats.critical} Critical Reports</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: '📋', color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'yellow' },
          { label: 'Investigating', value: stats.investigating, icon: '🔍', color: 'blue' },
          { label: 'Resolved', value: stats.resolved, icon: '✅', color: 'green' },
          { label: 'Critical', value: stats.critical, icon: '🚨', color: 'red' }
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
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="property">Property</option>
            <option value="user">User</option>
            <option value="review">Review</option>
            <option value="message">Message</option>
          </select>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'investigating', 'resolved', 'dismissed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
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

      {/* Reports List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-1/4" />
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-2xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Reports Found</h3>
          <p className="text-slate-400">
            {searchTerm || filter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No reports have been submitted yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-slate-800 rounded-2xl p-6 border-l-4 ${
                  report.priority === 'critical' ? 'border-l-red-500' :
                  report.priority === 'high' ? 'border-l-orange-500' :
                  report.priority === 'medium' ? 'border-l-yellow-500' :
                  'border-l-slate-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Type Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.type === 'property' ? 'bg-blue-500/20 text-blue-400' :
                    report.type === 'user' ? 'bg-purple-500/20 text-purple-400' :
                    report.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {getTypeIcon(report.type)}
                  </div>

                  {/* Report Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(report.priority)}`}>
                        {report.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs capitalize border ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs capitalize">
                        {report.type}
                      </span>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                        {getReasonLabel(report.reason)}
                      </span>
                    </div>

                    <p className="text-white mb-2 line-clamp-2">{report.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Reported: <span className="text-red-400">{report.reportedUser.name}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(report.createdAt)}
                      </span>
                      <span>By: {report.reporter.name}</span>
                    </div>

                    {report.resolution && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400">
                          <strong>Resolution:</strong> {report.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    
                    {report.status === 'pending' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'investigating')}
                        disabled={actionLoading === report.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {actionLoading === report.id ? '...' : 'Investigate'}
                      </button>
                    )}
                    
                    {(report.status === 'pending' || report.status === 'investigating') && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                        disabled={actionLoading === report.id}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Report Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedReport(null);
              setResolution('');
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
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedReport.type === 'property' ? 'bg-blue-500/20 text-blue-400' :
                      selectedReport.type === 'user' ? 'bg-purple-500/20 text-purple-400' :
                      selectedReport.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {getTypeIcon(selectedReport.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white capitalize">
                        {selectedReport.type} Report
                      </h2>
                      <p className="text-slate-400 text-sm">ID: #{selectedReport.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedReport(null);
                      setResolution('');
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
                {/* Status & Priority */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedReport.priority)}`}>
                    {selectedReport.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm capitalize border ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                    {getReasonLabel(selectedReport.reason)}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Report Description</h3>
                  <p className="text-white bg-slate-700/50 rounded-xl p-4">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Reported User */}
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Reported User</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {selectedReport.reportedUser.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{selectedReport.reportedUser.name}</p>
                      <p className="text-slate-400 text-sm">{selectedReport.reportedUser.email}</p>
                    </div>
                    <Link
                      to={`/admin/users/${selectedReport.reportedUser.id}`}
                      className="px-3 py-1 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-500 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                {/* Reported Item */}
                {selectedReport.reportedItem && (
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-slate-400 mb-3">Reported Content</h3>
                    {selectedReport.reportedItem.type === 'property' && (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedReport.reportedItem.image}
                          alt={selectedReport.reportedItem.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{selectedReport.reportedItem.title}</p>
                          <p className="text-slate-400 text-sm">Property Listing</p>
                        </div>
                        <Link
                          to={`/properties/${selectedReport.reportedItem.id}`}
                          target="_blank"
                          className="px-3 py-1 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-500 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    )}
                    {selectedReport.reportedItem.type === 'review' && (
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < selectedReport.reportedItem.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-white italic">"{selectedReport.reportedItem.content}"</p>
                      </div>
                    )}
                    {selectedReport.reportedItem.type === 'message' && (
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-white">{selectedReport.reportedItem.content}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reporter */}
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Reported By</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedReport.reporter.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedReport.reporter.name}</p>
                      <p className="text-slate-400 text-sm">{selectedReport.reporter.email}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Created: {new Date(selectedReport.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedReport.updatedAt && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span>Updated: {new Date(selectedReport.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedReport.adminNotes && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-blue-400 mb-2">Admin Notes</h3>
                    <p className="text-slate-300">{selectedReport.adminNotes}</p>
                  </div>
                )}

                {/* Resolution */}
                {selectedReport.resolution && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-green-400 mb-2">Resolution</h3>
                    <p className="text-slate-300">{selectedReport.resolution}</p>
                  </div>
                )}

                {/* Resolve Form */}
                {(selectedReport.status === 'pending' || selectedReport.status === 'investigating') && (
                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Take Action</h3>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => takeAction(selectedReport, 'warn_user')}
                        disabled={actionLoading === selectedReport.id}
                        className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        ⚠️ Warn User
                      </button>
                      <button
                        onClick={() => takeAction(selectedReport, 'remove_content')}
                        disabled={actionLoading === selectedReport.id}
                        className="p-3 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        🗑️ Remove Content
                      </button>
                      <button
                        onClick={() => takeAction(selectedReport, 'ban_user')}
                        disabled={actionLoading === selectedReport.id}
                        className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        🚫 Ban User
                      </button>
                      {selectedReport.type === 'property' && (
                        <button
                          onClick={() => takeAction(selectedReport, 'delete_property')}
                          disabled={actionLoading === selectedReport.id}
                          className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          🏠 Delete Property
                        </button>
                      )}
                    </div>

                    {/* Resolution Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Resolution Notes
                      </label>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe how this report was resolved..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                        disabled={actionLoading === selectedReport.id || !resolution.trim()}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {actionLoading === selectedReport.id ? 'Processing...' : 'Mark as Resolved'}
                      </button>
                      <button
                        onClick={() => updateReportStatus(selectedReport.id, 'dismissed')}
                        disabled={actionLoading === selectedReport.id}
                        className="flex-1 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors font-medium disabled:opacity-50"
                      >
                        Dismiss Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminReports;