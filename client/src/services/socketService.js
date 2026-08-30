import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Connected to CivicLink real-time server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.IO] Disconnected:', reason);
    });
  }
  return socket;
};

export const joinIssueRoom = (issueId) => {
  const s = getSocket();
  if (s && issueId) {
    s.emit('join_issue', issueId);
  }
};

export const joinAdminFeed = () => {
  const s = getSocket();
  if (s) {
    s.emit('join_admin_feed');
  }
};
