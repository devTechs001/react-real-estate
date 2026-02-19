import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient;
let redisConnected = false;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      redisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Connected');
      redisConnected = true;
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis Reconnecting...');
    });

    redisClient.on('end', () => {
      console.log('⚠️ Redis Connection Ended');
      redisConnected = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('⚠️ Redis not available, continuing without caching');
    redisConnected = false;
    return null;
  }
};

export const isRedisConnected = () => redisConnected;

export const getRedisClient = () => {
  if (!redisClient) {
    return null;
  }
  return redisClient;
};

export const setCache = async (key, value, expirationInSeconds = 3600) => {
  if (!redisConnected) return;
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.setEx(key, expirationInSeconds, JSON.stringify(value));
  } catch (error) {
    // Silently fail when Redis is unavailable
  }
};

export const getCache = async (key) => {
  if (!redisConnected) return null;
  try {
    const client = getRedisClient();
    if (!client) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redisConnected) return;
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.del(key);
  } catch (error) {
    // Silently fail when Redis is unavailable
  }
};

export const clearCache = async (pattern = '*') => {
  if (!redisConnected) return;
  try {
    const client = getRedisClient();
    if (!client) return;
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    // Silently fail when Redis is unavailable
  }
};

export default redisClient;