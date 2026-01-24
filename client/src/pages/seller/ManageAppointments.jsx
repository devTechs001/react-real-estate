import { useState, useEffect } from 'react';
import { FaCalendar, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get('/seller/appointments', { params });
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/seller/appointments/${id}`, { status });
      setAppointments(
        appointments.map((a) => (a._id === id ? { ...a, status } : a))
      );
      toast.success(`Appointment ${status}`);
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      confirmed: 'green',
      cancelled: 'red',
      completed: 'blue',
    };
    return colors[status] || 'gray';
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="Manage Appointments" description="Manage property viewing appointments" />

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaCalendar className="inline mr-3" />
            Manage Appointments
          </h1>
          <p className="text-xl">View and manage property viewing requests</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No appointments found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No appointment requests yet'
                : `No ${filter} appointments`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {appointment.property.title}
                      </h3>
                      <Badge color={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      <p>
                        <strong>Client:</strong> {appointment.client.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {appointment.client.email}
                      </p>
                      <p>
                        <FaCalendar className="inline mr-2" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p>
                        <FaClock className="inline mr-2" />
                        {appointment.time}
                      </p>
                    </div>

                    {appointment.notes && (
                      <p className="mt-2 text-gray-600">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>

                  {appointment.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                        className="btn btn-success"
                      >
                        <FaCheck className="mr-2" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                        className="btn btn-danger"
                      >
                        <FaTimes className="mr-2" />
                        Decline
                      </button>
                    </div>
                  )}

                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                      className="btn btn-primary"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageAppointments;
