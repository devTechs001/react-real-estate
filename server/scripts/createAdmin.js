import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate');
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'devtechs842@gmail.com' });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');

      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      existingAdmin.name = 'Admin';
      existingAdmin.password = 'pass123'; // This will be hashed by the pre-save hook
      await existingAdmin.save();

      console.log('Admin user updated successfully');
      console.log('Email: devtechs842@gmail.com');
      console.log('Password: pass123');
    } else {
      // Create admin user
      const admin = await User.create({
        name: 'Admin',
        email: 'devtechs842@gmail.com',
        password: 'pass123',
        role: 'admin',
        isVerified: true,
      });

      console.log('Admin user created successfully');
      console.log('Email: devtechs842@gmail.com');
      console.log('Password: pass123');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
