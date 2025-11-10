import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import connectDB from '../config/database.js';

dotenv.config();

const users = [];
const properties = [];

const createUsers = async () => {
  console.log('Creating users...');
  
  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@realestate.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  });
  users.push(admin);

  // Create agents
  for (let i = 0; i < 5; i++) {
    const agent = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
      role: 'agent',
      phone: faker.phone.number(),
      isVerified: true,
    });
    users.push(agent);
  }

  // Create regular users
  for (let i = 0; i < 10; i++) {
    const user = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
      role: 'user',
      phone: faker.phone.number(),
      isVerified: true,
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);
};

const createProperties = async () => {
  console.log('Creating properties...');

  const propertyTypes = ['apartment', 'house', 'villa', 'condo', 'townhouse'];
  const listingTypes = ['sale', 'rent'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
  const amenities = ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security', 'Elevator', 'Air Conditioning'];

  for (let i = 0; i < 50; i++) {
    const randomAgent = users[Math.floor(Math.random() * 5) + 1]; // Random agent
    const cityIndex = Math.floor(Math.random() * cities.length);
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    const area = Math.floor(Math.random() * 3000) + 500;
    const price = Math.floor(Math.random() * 1000000) + 100000;

    const property = await Property.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3),
      price: price,
      propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      listingType: listingTypes[Math.floor(Math.random() * listingTypes.length)],
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area: area,
      yearBuilt: Math.floor(Math.random() * 40) + 1980,
      address: faker.location.streetAddress(),
      city: cities[cityIndex],
      state: states[cityIndex],
      zipCode: faker.location.zipCode(),
      country: 'USA',
      location: `${cities[cityIndex]}, ${states[cityIndex]}`,
      owner: randomAgent._id,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
      ],
      amenities: faker.helpers.arrayElements(amenities, Math.floor(Math.random() * 5) + 2),
      views: Math.floor(Math.random() * 500),
      featured: Math.random() > 0.8,
      moderationStatus: 'approved',
    });

    properties.push(property);
  }

  console.log(`✅ Created ${properties.length} properties`);
};

const createReviews = async () => {
  console.log('Creating reviews...');

  let reviewCount = 0;
  for (let i = 0; i < 30; i++) {
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: randomProperty._id,
      user: randomUser._id,
    });

    if (!existingReview) {
      await Review.create({
        property: randomProperty._id,
        user: randomUser._id,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        comment: faker.lorem.paragraph(),
      });
      reviewCount++;
    }
  }

  console.log(`✅ Created ${reviewCount} reviews`);
};

const importData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Property.deleteMany();
    await Review.deleteMany();
    
    console.log('🗑️  Data destroyed');

    await createUsers();
    await createProperties();
    await createReviews();

    console.log('✅ Data imported successfully');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@realestate.com / admin123');
    console.log('User: Any generated email / password123');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Property.deleteMany();
    await Review.deleteMany();

    console.log('🗑️  Data destroyed');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}