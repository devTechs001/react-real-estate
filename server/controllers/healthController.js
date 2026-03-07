import mongoose from 'mongoose';
import redis from '../config/redis.js';

// @desc    Health check
// @route   GET /api/health
// @access  Public
export const healthCheck = async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    // Check database connection
    try {
      const dbState = mongoose.connection.readyState;
      healthData.database = {
        status: dbState === 1 ? 'connected' : 'disconnected',
        readyState: dbState,
      };
    } catch (error) {
      healthData.database = {
        status: 'error',
        error: error.message,
      };
    }

    // Check Redis connection
    try {
      if (redis) {
        await redis.ping();
        healthData.redis = {
          status: 'connected',
        };
      } else {
        healthData.redis = {
          status: 'not configured',
        };
      }
    } catch (error) {
      healthData.redis = {
        status: 'error',
        error: error.message,
      };
    }

    // Memory usage
    const memUsage = process.memoryUsage();
    healthData.memory = {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    };

    // CPU usage
    const cpuUsage = process.cpuUsage();
    healthData.cpu = {
      user: `${Math.round(cpuUsage.user / 1024 / 1024)}ms`,
      system: `${Math.round(cpuUsage.system / 1024 / 1024)}ms`,
    };

    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// @desc    Detailed health check
// @route   GET /api/health/detailed
// @access  Public
export const detailedHealthCheck = async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    // Database detailed check
    try {
      const dbState = mongoose.connection.readyState;
      const dbHost = mongoose.connection.host;
      const dbName = mongoose.connection.name;

      healthData.database = {
        status: dbState === 1 ? 'connected' : 'disconnected',
        readyState: dbState,
        host: dbHost,
        name: dbName,
        collections: await mongoose.connection.db.listCollections().toArray(),
      };
    } catch (error) {
      healthData.database = {
        status: 'error',
        error: error.message,
      };
    }

    // Redis detailed check
    try {
      if (redis) {
        await redis.ping();
        const info = await redis.info();
        healthData.redis = {
          status: 'connected',
          info: {
            connected_clients: info.match(/connected_clients:(\d+)/)?.[1],
            used_memory: info.match(/used_memory:(\d+)/)?.[1],
            uptime_in_seconds: info.match(/uptime_in_seconds:(\d+)/)?.[1],
          },
        };
      } else {
        healthData.redis = {
          status: 'not configured',
        };
      }
    } catch (error) {
      healthData.redis = {
        status: 'error',
        error: error.message,
      };
    }

    // System resources
    healthData.system = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
    };

    // API Statistics (if available)
    try {
      const User = (await import('../models/User.js')).default;
      const Property = (await import('../models/Property.js')).default;

      healthData.statistics = {
        totalUsers: await User.countDocuments(),
        totalProperties: await Property.countDocuments(),
      };
    } catch (error) {
      healthData.statistics = {
        error: 'Unable to fetch statistics',
      };
    }

    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// @desc    Readiness check
// @route   GET /api/health/ready
// @access  Public
export const readinessCheck = async (req, res) => {
  try {
    const checks = {
      database: false,
      redis: false,
    };

    // Check database
    if (mongoose.connection.readyState === 1) {
      checks.database = true;
    }

    // Check Redis
    try {
      if (redis) {
        await redis.ping();
        checks.redis = true;
      }
    } catch (error) {
      checks.redis = false;
    }

    const allHealthy = Object.values(checks).every((check) => check);

    if (allHealthy) {
      res.status(200).json({
        status: 'ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// @desc    Liveness check
// @route   GET /api/health/live
// @access  Public
export const livenessCheck = async (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
};
