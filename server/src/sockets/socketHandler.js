/**
 * Socket.IO event handler for real-time tracking
 * @param {import('socket.io').Server} io
 */
export const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for a specific issue
    socket.on('join_issue', (issueId) => {
      if (issueId) {
        socket.join(`issue_${issueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room issue_${issueId}`);
      }
    });

    // Leave issue room
    socket.on('leave_issue', (issueId) => {
      if (issueId) {
        socket.leave(`issue_${issueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left room issue_${issueId}`);
      }
    });

    // Join admin live feed room
    socket.on('join_admin_feed', () => {
      socket.join('admin_feed');
      console.log(`[Socket.IO] Socket ${socket.id} joined admin_feed`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
