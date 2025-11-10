import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit contact form
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: '123 Real Estate St, New York, NY 10001',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'contact@realestate.com',
    },
  ];

  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with our team for any inquiries"
      />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="text-2xl text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
              <p className="text-gray-600">{info.details}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
                required
              />
            </div>

            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you need..."
              rows={6}
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;