import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { setupSocketHandler } from './sockets/socketHandler.js';

// Server instance & setup
// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach Socket.IO instance to Express app
app.set('io', io);

// Setup Socket event listeners
setupSocketHandler(io);

// Start server after connecting to MongoDB
const startServer = async () => {
  await connectDB();

  const PORT = ENV.PORT;
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Civic Reporting Server running on port ${PORT}`);
    console.log(`📡 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 REST API: http://localhost:${PORT}/api`);
    console.log(`🔌 Socket.IO: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});
