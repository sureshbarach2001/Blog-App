const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const connectDB = require("./config/database");
const redisClient = require("./config/redis");
const errorHandler = require("./controllers/middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// 🔒 Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nivox-personal-blog-platform.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// 📜 Logging Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Middleware for parsing JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Test Route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is running successfully" });
});

// 🛠 Routes
app.use("/api/blogs", require("./routes/blogRoutes")); // Blog Routes
app.use("/api/auth", require("./routes/authRoutes")); // Auth Routes

// ❌ Error Handling Middleware (Must be last!)
app.use(errorHandler);

// 🌐 Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// 🔥 Handle Uncaught Errors & Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message, err.stack);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message, err.stack);
  process.exit(1);
});

// 🔄 Graceful Shutdown (Cleanup MongoDB & Redis on exit)
process.on("SIGINT", async () => {
  console.log("🔻 Gracefully shutting down...");
  await redisClient.quit(); // Close Redis connection
  process.exit(0);
});
