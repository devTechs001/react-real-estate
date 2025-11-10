import { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';

const AppointmentForm = ({ property, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    type: 'viewing',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  // Get tomorrow's date for minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ ...formData, propertyId: property._id });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Schedule Appointment: {property.title}
        </h3>
        <p className="text-gray-600">{property.address}</p>
      </div>

      <Input
        label="Preferred Date"
        type="date"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={handleChange}
        min={minDate}
        required
      />

      <Select
        label="Preferred Time"
        name="appointmentTime"
        value={formData.appointmentTime}
        onChange={handleChange}
        options={timeSlots.map((time) => ({ value: time, label: time }))}
        placeholder="Select time"
        required
      />

      <Select
        label="Appointment Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={[
          { value: 'viewing', label: 'Property Viewing' },
          { value: 'virtual_tour', label: 'Virtual Tour' },
          { value: 'consultation', label: 'Consultation' },
        ]}
      />

      <Textarea
        label="Additional Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={4}
        placeholder="Any special requirements or questions..."
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          The property owner will review your request and confirm the appointment.
          You'll receive a notification once confirmed.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          Request Appointment
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AppointmentForm;