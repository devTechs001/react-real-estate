import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Property from './models/Property.js';
import connectDB from './config/database.js';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'John Admin',
    email: 'admin@realestate.com',
    password: '$2a$10$M7KqQpZxVzN8jKqL5mZxW.rYzJ5KqL5mZxW.rYzJ5KqL5mZxW.rY', // hashed 'password123'
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Sarah Agent',
    email: 'agent@realestate.com',
    password: '$2a$10$M7KqQpZxVzN8jKqL5mZxW.rYzJ5KqL5mZxW.rYzJ5KqL5mZxW.rY',
    role: 'agent',
    isActive: true,
    phone: '+1-555-0102',
  },
  {
    name: 'Mike Client',
    email: 'client@realestate.com',
    password: '$2a$10$M7KqQpZxVzN8jKqL5mZxW.rYzJ5KqL5mZxW.rYzJ5KqL5mZxW.rY',
    role: 'user',
    isActive: true,
    phone: '+1-555-0103',
  },
];

const sampleProperties = [
  {
    title: 'Modern Downtown Loft',
    description: 'Stunning modern loft in the heart of downtown with floor-to-ceiling windows and city views.',
    price: 450000,
    location: 'New York, NY',
    address: '123 Broadway St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    yearBuilt: 2018,
    status: 'available',
    moderationStatus: 'approved',
    features: ['Gym', 'Pool', 'Parking', 'Elevator'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    views: 245,
  },
  {
    title: 'Luxury Waterfront Villa',
    description: 'Beautiful waterfront villa with private dock and panoramic ocean views.',
    price: 1250000,
    location: 'Miami, FL',
    address: '456 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    propertyType: 'villa',
    listingType: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    yearBuilt: 2020,
    status: 'available',
    moderationStatus: 'approved',
    features: ['Pool', 'Waterfront', 'Garage', 'Garden'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    views: 512,
  },
  {
    title: 'Cozy Family Home',
    description: 'Perfect family home in quiet neighborhood with great schools nearby.',
    price: 380000,
    location: 'Austin, TX',
    address: '789 Oak Lane',
    city: 'Austin',
    state: 'TX',
    zipCode: '73301',
    propertyType: 'house',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    yearBuilt: 2015,
    status: 'available',
    moderationStatus: 'approved',
    features: ['Garage', 'Garden', 'Fireplace'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    views: 189,
  },
  {
    title: 'Urban Studio Apartment',
    description: 'Efficient studio apartment perfect for young professionals.',
    price: 220000,
    location: 'Seattle, WA',
    address: '321 Pine St',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    yearBuilt: 2019,
    status: 'available',
    moderationStatus: 'approved',
    features: ['Gym', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    views: 156,
  },
  {
    title: 'Mountain Retreat Cabin',
    description: 'Peaceful cabin retreat nestled in the mountains with stunning views.',
    price: 550000,
    location: 'Denver, CO',
    address: '555 Mountain View Rd',
    city: 'Denver',
    state: 'CO',
    zipCode: '80201',
    propertyType: 'house',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    yearBuilt: 2017,
    status: 'available',
    moderationStatus: 'approved',
    features: ['Fireplace', 'Mountain View', 'Deck'],
    images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'],
    views: 298,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('✅ Database connected');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Assign properties to agent
    const agent = users.find(u => u.role === 'agent');
    
    // Create properties
    const properties = sampleProperties.map(p => ({
      ...p,
      owner: agent._id,
    }));
    await Property.create(properties);
    console.log(`✅ Created ${properties.length} properties`);

    console.log('\n📊 SEED COMPLETE');
    console.log('================');
    console.log('Users created:');
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) - Password: password123`);
    });
    console.log('\nProperties created:', properties.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
}

seedDatabase();
