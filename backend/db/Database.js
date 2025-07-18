const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI || process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`💾 MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log(`❌ MongoDB connection failed: ${error.message}`);
      console.log(`ℹ️  Please install MongoDB or use Docker: docker run --name mongo -p 27017:27017 -d mongo`);
      // Don't exit in development, just log the error
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
};

module.exports = connectDatabase;