const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server.
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Verdantis backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Gracefully handle unexpected promise rejections (e.g. DB errors post-connect)
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
