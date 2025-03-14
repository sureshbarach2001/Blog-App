const { createClient } = require('redis');

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD || 'QCEIxu7r1wO0eXmBygZMV41p7OrtjYSp',
  socket: {
    host: process.env.REDIS_HOST || 'redis-19532.c81.us-east-1-2.ec2.redns.redis-cloud.com',
    port: process.env.REDIS_PORT || 19532,
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