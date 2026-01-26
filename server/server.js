import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import initSocket from './config/socket.js';

// Import AI services
import pricePredictionService from './ai/services/pricePredictionService.js';

// Routes
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import aiRoutes from './routes/ai.js';
import messageRoutes from './routes/messages.js';
import inquiryRoutes from './routes/inquiries.js';
import appointmentRoutes from './routes/appointments.js';
import favoriteRoutes from './routes/favorites.js';
import notificationRoutes from './routes/notification.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import savedSearchRoutes from './routes/savedSearches.js';
import paymentRoutes from './routes/payments.js';
import uploadRoutes from './routes/upload.js';
import referralRoutes from './routes/referrals.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
export const io = initSocket(server);

// Connect Database
connectDB();

// Initialize AI Models
(async () => {
  try {
    await pricePredictionService.loadModel();
    console.log('✅ AI services initialized');
  } catch (error) {
    console.error('⚠️ AI services initialization failed:', error.message);
  }
})();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Real Estate Platform API',
    version: '3.0.0',
    features: [
      'Property Management',
      'Real-time Messaging',
      'AI Chatbot',
      'Price Prediction',
      'Market Analytics',
      'Fraud Detection',
      'Smart Recommendations',
      'Appointment Scheduling',
      'Inquiry Management',
    ],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/saved-searches', savedSearchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 AI features enabled`);
  console.log(`💬 Real-time messaging enabled`);
});