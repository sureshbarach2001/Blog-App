const mongoose = require('mongoose');

const connectDB = async () => {
    const dbURI = process.env.DB_URI_PRODUCTION; // Use only production DB

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout if server is unresponsive
        });

        console.log(`✅ Connected to MongoDB: ${dbURI.replace(/:\/\/.*@/, '://*****:*****@')}`); // Hide credentials in logs

        // Enable debugging in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};

// Handle unexpected MongoDB disconnections
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Reconnecting...');
    connectDB();
});

module.exports = connectDB;
