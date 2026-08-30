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

import { User } from './models/User.js';

// Start server after connecting to MongoDB
const startServer = async () => {
  await connectDB();

  // Ensure default Admin credentials exist
  try {
    const adminEmail = 'admin@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Chief Municipal Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        ward: 'Central Administration Zone',
      });
      console.log(`🛡️  Admin account auto-created: ${adminEmail} (password: admin123)`);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      admin.password = 'admin123';
      await admin.save();
      console.log(`🛡️  Admin account updated: ${adminEmail} (role: admin)`);
    }
  } catch (err) {
    console.warn(`[Bootstrap] Admin seed notice:`, err.message);
  }

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
