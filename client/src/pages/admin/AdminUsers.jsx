// client/src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setUsers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        role: 'buyer',
        status: 'active',
        verified: true,
        createdAt: '2024-01-15',
        lastLogin: '2024-01-15T10:30:00',
        properties: 0,
        inquiries: 12,
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 2,
        name: 'Sarah Mitchell',
        email: 'sarah@example.com',
        phone: '+1 (555) 234-5678',
        role: 'seller',
        status: 'active',
        verified: true,
        createdAt: '2024-01-10',
        lastLogin: '2024-01-14T14:00:00',
        properties: 8,
        inquiries: 45,
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 345-6789',
        role: 'buyer',
        status: 'pending',
        verified: false,
        createdAt: '2024-01-18',
        lastLogin: null,
        properties: 0,
        inquiries: 0,
        image: 'https://randomuser.me/api/portraits/men/52.jpg'
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        role: 'seller',
        status: 'suspended',
        verified: true,
        createdAt: '2023-12-01',
        lastLogin: '2024-01-05T09:00:00',
        properties: 3,
        inquiries: 15,
        image: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
    ]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      suspended: 'bg-red-500/20 text-red-400'
    };
    return styles[status] || styles.pending;
  };

  const getRoleBadge = (role) => {
    const styles = {
      buyer: 'bg-blue-500/20 text-blue-400',
      seller: 'bg-purple-500/20 text-purple-400',
      admin: 'bg-red-500/20 text-red-400'
    };
    return styles[role] || styles.buyer;
  };

  const updateUserStatus = (id, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    toast.success(`User ${newStatus}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <SEO title="Users - Admin Dashboard" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">{users.length} total users</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'buyer', 'seller', 'active', 'pending', 'suspended'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm capitalize ${
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
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Properties</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Last Login</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="h-12 bg-slate-700 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-400" colSpan={6}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                        {user.verified && (
                          <span className="text-green-400" title="Verified">✓</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {user.properties}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg"
                            title="Suspend"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"
                            title="Activate"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing 1-4 of 4 users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedUser.name}</h4>
                  <p className="text-slate-400">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Phone</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Joined</p>
                    <p className="text-white">{selectedUser.createdAt}</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Properties</p>
                    <p className="text-white">{selectedUser.properties}</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Inquiries</p>
                    <p className="text-white">{selectedUser.inquiries}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                  Edit User
                </button>
                <button className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
                  Send Email
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