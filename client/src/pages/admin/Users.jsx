import { useState, useEffect } from 'react';
import { FaSearch, FaBan, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModal, setEditModal] = useState({ open: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(
        `/admin/users?page=${currentPage}&role=${filter !== 'all' ? filter : ''}`
      );
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">User Management</h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="agent">Agents</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.isVerified && (
                          <Badge variant="success" size="sm">
                            <FaCheck className="mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'danger'
                          : user.role === 'agent'
                          ? 'primary'
                          : 'gray'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.isActive ? 'success' : 'danger'}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditModal({ open: true, user })}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(user._id, user.isActive)
                        }
                        className="text-yellow-600 hover:text-yellow-700"
                        title="Toggle Status"
                      >
                        <FaBan />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title="Edit User"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setEditModal({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleUpdateRole(editModal.user._id, editModal.user.role);
                setEditModal({ open: false, user: null });
              }}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        {editModal.user && (
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">{editModal.user.name}</p>
              <p className="text-sm text-gray-600">{editModal.user.email}</p>
            </div>
            <Select
              label="Role"
              value={editModal.user.role}
              onChange={(e) =>
                setEditModal({
                  ...editModal,
                  user: { ...editModal.user, role: e.target.value },
                })
              }
              options={[
                { value: 'user', label: 'User' },
                { value: 'agent', label: 'Agent' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;