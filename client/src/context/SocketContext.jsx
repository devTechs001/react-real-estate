import { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import socketService from '../services/socketService';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      const socketInstance = socketService.connect(token);
      setSocket(socketInstance);

      socketInstance.on('user_online', (userId) => {
        setOnlineUsers((prev) => [...new Set([...prev, userId])]);
      });

      socketInstance.on('user_offline', (userId) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};