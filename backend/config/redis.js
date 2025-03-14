const { createClient } = require('redis');

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD || 'e005e672dcfa92a',
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message, err.stack);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message, err.stack);
    // Optionally, don't exit here to keep the app running
  }
};

connectRedis();

module.exports = redisClient;