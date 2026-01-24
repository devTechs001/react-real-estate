import { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const InquiryForm = ({ property, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    contactMethod: 'email',
    phone: user?.phone || '',
    preferredTime: '',
  });
  const [loading, setLoading] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Inquire about: {property.title}
        </h3>
        <p className="text-gray-600">{property.location}</p>
      </div>

      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="e.g., Request for viewing"
        required
      />

      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={5}
        placeholder="Tell us what you'd like to know..."
        required
      />

      <Select
        label="Preferred Contact Method"
        name="contactMethod"
        value={formData.contactMethod}
        onChange={handleChange}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'message', label: 'Platform Message' },
        ]}
      />

      {formData.contactMethod === 'phone' && (
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          required
        />
      )}

      <Input
        label="Preferred Contact Time"
        name="preferredTime"
        value={formData.preferredTime}
        onChange={handleChange}
        placeholder="e.g., Weekdays after 5 PM"
      />

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          Send Inquiry
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

export default InquiryForm;