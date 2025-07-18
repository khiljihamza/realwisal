const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
  process.exit(1);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// create server
const server = app.listen(process.env.PORT || 8000, () => {
  console.log(
    `🚀 Server is running on http://localhost:${process.env.PORT || 8000}`
  );
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: Connected to MongoDB`);
  
  if (process.env.ELASTICSEARCH_URL) {
    console.log(`🔍 Search: ElasticSearch enabled`);
  }
  
  if (process.env.REDIS_URL) {
    console.log(`⚡ Cache: Redis enabled`);
  }
  
  console.log(`🔒 Security: Enhanced middleware active`);
  console.log(`💳 Payments: Multiple gateways configured`);
  console.log(`🤖 AI: Recommendation engine ready`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    require('mongoose').connection.close(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
  
  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error('⚠️  Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

// Memory usage monitoring in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory usage: ${Math.round(memUsage.rss / 1024 / 1024 * 100) / 100} MB`);
  }, 60000); // Log every minute
}
