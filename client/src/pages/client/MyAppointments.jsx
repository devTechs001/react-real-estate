import { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
} from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState({ open: false, id: null });
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await appointmentService.cancelAppointment(
        cancelModal.id,
        cancelReason
      );
      toast.success('Appointment cancelled');
      setCancelModal({ open: false, id: null });
      setCancelReason('');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const statusConfig = {
    pending: { variant: 'warning', icon: FaClock, label: 'Pending' },
    confirmed: { variant: 'success', icon: FaCheckCircle, label: 'Confirmed' },
    cancelled: { variant: 'danger', icon: FaTimesCircle, label: 'Cancelled' },
    completed: { variant: 'info', icon: FaCheckCircle, label: 'Completed' },
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Appointments</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b overflow-x-auto">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const config = statusConfig[appointment.status];
            const isPast =
              new Date(appointment.appointmentDate) < new Date();

            return (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {appointment.property.title}
                      </h3>
                      <Badge variant={config.variant}>
                        <config.icon className="mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">
                      {appointment.property.address}
                    </p>
                  </div>
                  <img
                    src={appointment.property.images[0]}
                    alt={appointment.property.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCalendar className="text-primary-600" />
                    <span>
                      {format(
                        new Date(appointment.appointmentDate),
                        'MMMM dd, yyyy'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-primary-600" />
                    <span>{appointment.appointmentTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Type:
                    </span>{' '}
                    <span className="text-gray-900 capitalize">
                      {appointment.type}
                    </span>
                  </div>

                  {appointment.clientNotes && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Your Notes:
                      </span>
                      <p className="text-gray-900 mt-1">
                        {appointment.clientNotes}
                      </p>
                    </div>
                  )}

                  {appointment.sellerNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">
                        Seller Notes:
                      </span>
                      <p className="text-blue-800 mt-1">
                        {appointment.sellerNotes}
                      </p>
                    </div>
                  )}

                  {appointment.status === 'cancelled' &&
                    appointment.cancellationReason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <span className="text-sm font-medium text-red-900">
                          Cancellation Reason:
                        </span>
                        <p className="text-red-800 mt-1">
                          {appointment.cancellationReason}
                        </p>
                      </div>
                    )}
                </div>

                {appointment.status === 'pending' ||
                appointment.status === 'confirmed' ? (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <button
                      onClick={() =>
                        setCancelModal({ open: true, id: appointment._id })
                      }
                      className="btn bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <FaBan className="mr-2" />
                      Cancel Appointment
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, id: null })}
        title="Cancel Appointment"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setCancelModal({ open: false, id: null })}
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Appointment
            </Button>
          </div>
        }
      >
        <Textarea
          label="Reason for cancellation (optional)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={4}
          placeholder="Let the seller know why..."
        />
      </Modal>
    </div>
  );
};

export default MyAppointments;