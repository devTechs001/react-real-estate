import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate');
    console.log('MongoDB connected');

    const email = 'devtechs842@gmail.com';
    const newPassword = 'pass123';

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user directly
    const result = await User.updateOne(
      { email },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          name: 'Admin'
        } 
      }
    );

    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      console.log('✅ Password reset successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${newPassword}`);
    } else {
      console.log('⚠️ User not found');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
