import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import DashboardSidebar from './DashboardSidebar'; // Assuming this exists
import AIAssistant from '../ai/AIAssistant';

const SellerLayout = () => {
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
      <AIAssistant />
    </div>
  );
};

export default SellerLayout;