import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'devtechs842@gmail.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'devtechs842@gmail.com',
      password: 'pass1234',
      role: 'admin',
      phone: '+1 (555) 000-0000',
      isVerified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    });

    console.log('✅ Admin user created successfully');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`ID: ${adminUser._id}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
