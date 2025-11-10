import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import mongoose from 'mongoose';

let token;
let userId;
let propertyId;

beforeAll(async () => {
  // Create test user and get token
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Property.deleteMany({});
  await mongoose.connection.close();
});

describe('Property API', () => {
  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Property',
          description: 'A beautiful test property',
          price: 500000,
          propertyType: 'house',
          listingType: 'sale',
          bedrooms: 3,
          bathrooms: 2,
          area: 2000,
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Test Property');
      propertyId = res.body._id;
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          title: 'Test Property',
          price: 500000,
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Property',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      const res = await request(app).get('/api/properties');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('properties');
      expect(Array.isArray(res.body.properties)).toBe(true);
    });

    it('should filter properties by type', async () => {
      const res = await request(app)
        .get('/api/properties')
        .query({ type: 'house' });

      expect(res.statusCode).toBe(200);
      expect(res.body.properties.every(p => p.propertyType === 'house')).toBe(true);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get a single property', async () => {
      const res = await request(app).get(`/api/properties/${propertyId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(propertyId.toString());
    });

    it('should return 404 for non-existent property', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/properties/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update a property', async () => {
      const res = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Property',
          price: 550000,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Property');
      expect(res.body.price).toBe(550000);
    });

    it('should fail to update without authentication', async () => {
      const res = await request(app)
        .put(`/api/properties/${propertyId}`)
        .send({
          title: 'Updated Property',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete a property', async () => {
      const res = await request(app)
        .delete(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Property removed');
    });
  });
});