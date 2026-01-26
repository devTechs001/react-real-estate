import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import DashboardSidebar from './DashboardSidebar'; // Assuming this exists
import AIAssistant from '../ai/AIAssistant';
import AISecurityWrapper from '../AISecurityWrapper';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow mt-20">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <AISecurityWrapper>
        <AIAssistant />
      </AISecurityWrapper>
    </div>
  );
};

export default AdminLayout;