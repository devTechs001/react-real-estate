// client/src/pages/user/Appointments.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAppointments([
      {
        id: 1,
        property: {
          id: 1,
          title: 'Luxury Waterfront Villa',
          address: '123 Ocean Drive, Miami Beach, FL',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
          price: 2500000
        },
        agent: {
          name: 'Sarah Mitchell',
          phone: '+1 (555) 123-4567',
          email: 'sarah@homescape.com',
          image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        date: '2024-01-20',
        time: '10:00 AM',
        endTime: '11:00 AM',
        status: 'confirmed',
        type: 'in-person',
        notes: 'Please arrive 5 minutes early'
      },
      {
        id: 2,
        property: {
          id: 2,
          title: 'Modern Downtown Penthouse',
          address: '456 Park Avenue, New York, NY',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
          price: 1800000
        },
        agent: {
          name: 'John Anderson',
          phone: '+1 (555) 987-6543',
          email: 'john@homescape.com',
          image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        date: '2024-01-22',
        time: '2:00 PM',
        endTime: '3:00 PM',
        status: 'pending',
        type: 'virtual',
        notes: 'Video call link will be sent before the appointment'
      },
      {
        id: 3,
        property: {
          id: 3,
          title: 'Cozy Mountain Cabin',
          address: '789 Mountain View Rd, Aspen, CO',
          image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
          price: 450000
        },
        agent: {
          name: 'Emily Davis',
          phone: '+1 (555) 456-7890',
          email: 'emily@homescape.com',
          image: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        date: '2024-01-10',
        time: '11:00 AM',
        endTime: '12:00 PM',
        status: 'completed',
        type: 'in-person',
        notes: ''
      },
    ]);
    setLoading(false);
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'cancelled' } : a
    ));
    toast.success('Appointment cancelled');
  };

  const getStatusInfo = (status) => {
    const info = {
      confirmed: { color: 'bg-green-100 text-green-700', icon: '✓', label: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: '⏳', label: 'Pending' },
      completed: { color: 'bg-blue-100 text-blue-700', icon: '✓', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: '✕', label: 'Cancelled' }
    };
    return info[status] || info.pending;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date();

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'upcoming') return isUpcoming(a.date) && a.status !== 'cancelled';
    if (filter === 'past') return !isUpcoming(a.date) || a.status === 'completed';
    if (filter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  // Get next 7 days for calendar view
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <>
      <SEO title="My Appointments - HomeScape" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">{appointments.filter(a => isUpcoming(a.date) && a.status !== 'cancelled').length} upcoming tours</p>
        </div>
        <div className="flex gap-2">
          {['upcoming', 'past', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Week Calendar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">This Week</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const hasAppointment = appointments.some(a => a.date === dateStr && a.status !== 'cancelled');
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`text-center p-3 rounded-xl transition-colors ${
                  isToday ? 'bg-blue-600 text-white' : hasAppointment ? 'bg-blue-50' : ''
                }`}
              >
                <p className={`text-xs font-medium ${isToday ? 'text-blue-200' : 'text-gray-500'}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                  {date.getDate()}
                </p>
                {hasAppointment && (
                  <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${isToday ? 'bg-white' : 'bg-blue-600'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex gap-6">
                <div className="w-40 h-28 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No appointments</h2>
          <p className="text-gray-600 mb-6">You don't have any {filter} appointments</p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const statusInfo = getStatusInfo(appointment.status);
            
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <Link to={`/properties/${appointment.property.id}`} className="flex-shrink-0">
                    <img
                      src={appointment.property.image}
                      alt={appointment.property.title}
                      className="w-full lg:w-40 h-28 object-cover rounded-xl"
                    />
                  </Link>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <Link to={`/properties/${appointment.property.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {appointment.property.title}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {appointment.property.address}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium text-gray-900">{appointment.time} - {appointment.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          {appointment.type === 'virtual' ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-medium text-gray-900 capitalize">{appointment.type} Tour</p>
                        </div>
                      </div>
                    </div>

                    {/* Agent & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appointment.agent.image}
                          alt={appointment.agent.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.agent.name}</p>
                          <a href={`tel:${appointment.agent.phone}`} className="text-sm text-blue-600 hover:underline">
                            {appointment.agent.phone}
                          </a>
                        </div>
                      </div>

                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowRescheduleModal(appointment)}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-medium"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowRescheduleModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowRescheduleModal(null)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      toast.success('Reschedule request sent!');
                      setShowRescheduleModal(null);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Request Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Appointments;