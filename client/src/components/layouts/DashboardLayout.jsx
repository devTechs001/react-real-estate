import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import AIAssistant from '../ai/AIAssistant';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <Outlet />
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default DashboardLayout;