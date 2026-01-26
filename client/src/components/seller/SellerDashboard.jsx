import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaEnvelope,
  FaCalendar,
  FaEye,
  FaChartLine,
  FaDollarSign,
} from 'react-icons/fa';
import { dashboardService } from '../../services/dashboardService';
import { propertyService } from '../../services/PropertyService';
import { inquiryService } from '../../services/InquiryService';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../common/Loader';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    inquiries: 0,
    appointments: 0,
    totalViews: 0,
    pendingInquiries: 0,
    pendingAppointments: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to get dashboard data from the new endpoint first
      try {
        const dashboardData = await dashboardService.getDashboardData();
        if (dashboardData.role === 'agent') {
          setStats(dashboardData.stats);
          // Set recent data if available in the response
          if (dashboardData.recentProperties) {
            setRecentInquiries(dashboardData.recentProperties.slice(0, 5)); // Placeholder
          }
          if (dashboardData.appointments) {
            setRecentAppointments(dashboardData.appointments.slice(0, 5)); // Placeholder
          }
        }
      } catch (dashboardError) {
        console.warn('Using fallback dashboard data:', dashboardError);

        // Fallback to the original method if the new endpoint fails
        const [properties, inquiries, appointments] = await Promise.all([
          propertyService.getUserProperties(),
          inquiryService.getReceivedInquiries(),
          appointmentService.getReceivedAppointments(),
        ]);

        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
        const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;
        const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

        setStats({
          properties: properties.length,
          inquiries: inquiries.length,
          appointments: appointments.length,
          totalViews,
          pendingInquiries,
          pendingAppointments,
        });

        setRecentInquiries(inquiries.slice(0, 5));
        setRecentAppointments(appointments.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    { icon: FaHome, label: 'Active Listings', value: stats.properties, color: 'primary', link: '/seller/properties' },
    { icon: FaEnvelope, label: 'Inquiries', value: stats.inquiries, color: 'blue', badge: stats.pendingInquiries, link: '/seller/inquiries' },
    { icon: FaCalendar, label: 'Appointments', value: stats.appointments, color: 'green', badge: stats.pendingAppointments, link: '/seller/appointments' },
    { icon: FaEye, label: 'Total Views', value: stats.totalViews, color: 'purple', link: '/seller/analytics' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your properties and track performance</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 text-white">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/add-property" className="btn bg-white text-primary-600 hover:bg-gray-100">
            <FaHome className="mr-2" />
            Add Property
          </Link>
          <Link to="/seller/inquiries?status=pending" className="btn bg-white/20 hover:bg-white/30 text-white">
            <FaEnvelope className="mr-2" />
            View Pending Inquiries ({stats.pendingInquiries})
          </Link>
          <Link to="/seller/appointments?status=pending" className="btn bg-white/20 hover:bg-white/30 text-white">
            <FaCalendar className="mr-2" />
            View Pending Appointments ({stats.pendingAppointments})
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative"
          >
            {stat.badge > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stat.badge} new
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Inquiries</h3>
            <Link to="/seller/inquiries" className="text-primary-600 hover:text-primary-700 text-sm">
              View All →
            </Link>
          </div>
          
          {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry._id} className="border-l-4 border-primary-600 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">{inquiry.client.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      inquiry.status === 'responded' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{inquiry.property.title}</p>
                  <p className="text-xs text-gray-500">{inquiry.subject}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No inquiries yet</p>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
            <Link to="/seller/appointments" className="text-primary-600 hover:text-primary-700 text-sm">
              View All →
            </Link>
          </div>
          
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="border-l-4 border-green-600 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">{appointment.client.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{appointment.property.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;