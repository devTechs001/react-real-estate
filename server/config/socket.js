import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(socket.userId);

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.receiverId).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    // Online status
    socket.on('online', () => {
      socket.broadcast.emit('user_online', socket.userId);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      socket.broadcast.emit('user_offline', socket.userId);
    });
  });

  return io;
};

export default initSocket;