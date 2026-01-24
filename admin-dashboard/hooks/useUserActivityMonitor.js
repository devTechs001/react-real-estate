import { useState, useEffect } from 'react';

const useUserActivityMonitor = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate real-time user activity monitoring
    const interval = setInterval(() => {
      // In a real app, this would connect to a WebSocket or polling endpoint
      const mockActiveUsers = [
        { id: 1, name: 'John Doe', lastActivity: 'viewing property', time: '2 min ago' },
        { id: 2, name: 'Jane Smith', lastActivity: 'submitting inquiry', time: '5 min ago' },
        { id: 3, name: 'Bob Johnson', lastActivity: 'logging in', time: '8 min ago' }
      ];
      
      const mockActivities = [
        { id: 1, user: 'John Doe', action: 'viewed property', property: '123 Main St', time: '2 min ago' },
        { id: 2, user: 'Jane Smith', action: 'submitted inquiry', property: '456 Oak Ave', time: '5 min ago' },
        { id: 3, user: 'Mike Wilson', action: 'added property', property: '789 Pine Rd', time: '7 min ago' }
      ];
      
      setActiveUsers(mockActiveUsers);
      setRecentActivities(mockActivities);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    activeUsers,
    recentActivities,
    refreshActivity: () => {
      // In a real app, this would trigger a manual refresh
    }
  };
};

export default useUserActivityMonitor;