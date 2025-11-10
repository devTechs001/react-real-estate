import request from 'supertest';
import app from '../server.js';

describe('AI API', () => {
  describe('POST /api/ai/chat', () => {
    it('should get AI chat response', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [
            { role: 'user', content: 'Tell me about real estate investment' },
          ],
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('response');
    }, 30000); // 30 second timeout for AI calls

    it('should fail without messages', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/ai/predict-price', () => {
    it('should predict property price', async () => {
      const res = await request(app)
        .post('/api/ai/predict-price')
        .send({
          propertyType: 'house',
          location: 'New York, NY',
          bedrooms: 3,
          bathrooms: 2,
          area: 2000,
          yearBuilt: 2010,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.prediction).toHaveProperty('predictedPrice');
    }, 30000);
  });
});