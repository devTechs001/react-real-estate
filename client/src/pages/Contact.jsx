import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle, FaHeadset, FaUser, FaBuilding } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/TextArea';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    type: 'general',
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
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Submit contact form
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        type: 'general',
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
      title: 'Headquarters',
      details: '123 Real Estate Plaza, New York, NY 10001',
      type: 'address',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      type: 'phone',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'contact@realestate.com',
      type: 'email',
    },
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Real Estate Plaza, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@realestate.com',
    },
    {
      city: 'Los Angeles',
      address: '456 Property Ave, Los Angeles, CA 90001',
      phone: '+1 (555) 234-5678',
      email: 'la@realestate.com',
    },
    {
      city: 'Chicago',
      address: '789 Realty Drive, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'chicago@realestate.com',
    },
  ];

  const faqs = [
    {
      question: 'What is the typical response time?',
      answer: 'We typically respond to inquiries within 24 business hours. For urgent matters, please call our phone line.',
    },
    {
      question: 'Do you offer international services?',
      answer: 'Yes, we serve customers in 50+ countries. Contact our international team for assistance.',
    },
    {
      question: 'Is there a consultation fee?',
      answer: 'Initial consultations are completely free. We only charge for specific services as discussed.',
    },
    {
      question: 'How can I schedule a property viewing?',
      answer: 'You can schedule viewings directly through our platform or contact our agents for assistance.',
    },
  ];

  return (
    <>
      <SEO 
        title="Contact Us - RealEstateHub"
        description="Get in touch with our expert team. Fast response times and dedicated support."
      />

      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ backgroundPosition: '200% center' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">Get In Touch</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
              Have questions? Our expert team is here to help you 24/7
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200"
              >
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <info.icon className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <p className="text-gray-700 text-lg">{info.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Inquiry Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="selling">Selling Property</option>
                    <option value="buying">Buying Property</option>
                    <option value="investment">Investment Opportunity</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-50 rounded-2xl p-10">
                <h3 className="text-2xl font-bold font-display mb-8">Additional Information</h3>

                {/* Response Time */}
                <div className="flex gap-4 mb-8">
                  <div className="flex-shrink-0 text-blue-600 text-2xl">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Response Time</h4>
                    <p className="text-gray-700">We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly.</p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex gap-4 mb-8">
                  <div className="flex-shrink-0 text-green-600 text-2xl">
                    <FaHeadset />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
                    <p className="text-gray-700">Our AI assistant is available anytime. For human support, contact us during business hours.</p>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-purple-600 text-2xl">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Satisfaction Guaranteed</h4>
                    <p className="text-gray-700">We're committed to your satisfaction. If you're not happy, we'll work until you are.</p>
                  </div>
                </div>

                {/* Offices */}
                <div className="mt-10 pt-10 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-6">Our Offices</h4>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="bg-white rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-2">{office.city}</p>
                        <p className="text-sm text-gray-600 mb-1">{office.address}</p>
                        <p className="text-sm text-blue-600">{office.phone}</p>
                        <p className="text-sm text-blue-600">{office.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about our services</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <details className="group cursor-pointer p-6">
                  <summary className="flex justify-between items-center font-semibold text-gray-900 text-lg">
                    {faq.question}
                    <motion.span
                      animate={{ rotate: 0 }}
                      className="text-blue-600 group-open:rotate-180 transition-transform"
                    >
                      ▼
                    </motion.span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
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