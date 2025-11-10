import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import messageHandler from './messageHandler.js';
import notificationHandler from './notificationHandler.js';
import onlineStatusHandler from './onlineStatus.js';

const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Add user to online users
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date(),
    });

    // Join user's personal room
    socket.join(socket.userId);

    // Broadcast online status
    io.emit('user_online', {
      userId: socket.userId,
      user: {
        _id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
    });

    // Send online users list to newly connected user
    const onlineUsersList = Array.from(onlineUsers.values()).map((u) => ({
      userId: u.user._id,
      name: u.user.name,
      avatar: u.user.avatar,
    }));
    socket.emit('online_users', onlineUsersList);

    // Message handlers
    messageHandler(io, socket);

    // Notification handlers
    notificationHandler(io, socket);

    // Online status handlers
    onlineStatusHandler(io, socket, onlineUsers);

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
        userName: socket.user.name,
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.receiverId).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Property view tracking
    socket.on('view_property', async (propertyId) => {
      io.emit('property_viewed', {
        propertyId,
        viewerId: socket.userId,
      });
    });

    // Disconnect handler
    