import { useAuth } from '../hooks/useAuth';
import ClientDashboard from '../components/client/ClientDashboard';
import SellerDashboard from '../components/seller/SellerDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'agent') {
    return <SellerDashboard />;
  } else {
    return <ClientDashboard />;
  }
};

export default Dashboard;