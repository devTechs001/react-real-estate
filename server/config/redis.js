import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis Connection Error:', error);
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const setCache = async (key, value, expirationInSeconds = 3600) => {
  try {
    const client = getRedisClient();
    await client.setEx(key, expirationInSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Redis Set Error:', error);
  }
};

export const getCache = async (key) => {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Redis Delete Error:', error);
  }
};

export const clearCache = async (pattern = '*') => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Redis Clear Error:', error);
  }
};

export default redisClient;