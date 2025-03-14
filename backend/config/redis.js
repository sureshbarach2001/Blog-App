const redis = require('redis');
require('dotenv').config({ path: '.env' });

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => {
            console.warn(`⚠️ Redis reconnect attempt: ${retries}`);
            if (retries > 10) {
                console.error('❌ Too many Redis connection attempts. Exiting...');
                return new Error('Redis connection failed');
            }
            return Math.min(retries * 100, 3000);
        },
    },
    password: process.env.REDIS_PASSWORD || undefined,
});

// ✅ Handle connection events
redisClient.on('connect', () => console.log(`✅ Connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`));
redisClient.on('ready', () => console.log('🚀 Redis is ready to use'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
redisClient.on('end', () => console.warn('⚠️ Redis connection closed'));
redisClient.on('reconnecting', (attempt) => console.log(`🔄 Redis reconnecting (Attempt: ${attempt})...`));

// ✅ Establish connection
(async () => {
    try {
        console.log('🔑 REDIS_PASSWORD:', process.env.REDIS_PASSWORD);
        await redisClient.connect();
        console.log('🔗 Redis connection established');
        // Removed explicit auth call since password is provided in createClient
    } catch (error) {
        console.error('❌ Failed to connect to Redis:', error);
    }
})();

// 🛑 Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Closing Redis connection...');
    await redisClient.quit();
    console.log('✅ Redis disconnected');
    process.exit(0);
});

module.exports = redisClient;