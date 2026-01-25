import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  Warning: MONGODB_URI not set, skipping database connection');
      return;
    }

    console.log(`Attempting to connect to: ${process.env.MONGODB_URI}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error('Make sure MongoDB is running locally or update your MONGODB_URI in the .env file');
    // Don't exit the process to allow server to continue running
  }
};

export default connectDB;