import { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Loader from '../common/Loader';
import { formatDistanceToNow } from 'date-fns';

const AppointmentsList = ({ limit }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(limit ? data.slice(0, limit) : data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info',
    };
    return <Badge variant={variants[status] || 'gray'}>{status}</Badge>;
  };

  if (loading) return <Loader />;

  if (appointments.length === 0) {
    return (
      <Card className="text-center py-12">
        <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No appointments scheduled</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment._id} hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">
                  {appointment.property?.title || 'Property Viewing'}
                </h3>
                {getStatusBadge(appointment.status)}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-primary" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-primary" />
                  <span>{appointment.time}</span>
                </div>

                {appointment.property?.location && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{appointment.property.location}</span>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsList;
