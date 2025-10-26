require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http');

const app = http.createServer();
const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map(); // Store active rooms and their participants

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a room (challenge session)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    
    // Track participants
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  // Leave a room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    socket.to(roomId).emit('user-left', { userId: socket.id });
  });

  // WebRTC signaling - offer
  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      senderId: socket.id
    });
  });

  // WebRTC signaling - answer
  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      senderId: socket.id
    });
  });

  // ICE candidate exchange
  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      senderId: socket.id
    });
  });

  // Challenge events
  socket.on('challenge-start', (data) => {
    socket.to(data.roomId).emit('challenge-start', data.challenge);
  });

  socket.on('challenge-answer', (data) => {
    socket.to(data.roomId).emit('challenge-answer', {
      userId: socket.id,
      answer: data.answer
    });
  });

  socket.on('challenge-result', (data) => {
    socket.to(data.roomId).emit('challenge-result', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Clean up rooms
    for (const [roomId, participants] of rooms.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(roomId).emit('user-left', { userId: socket.id });
        if (participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

const PORT = process.env.SIGNALING_PORT || 4001;

app.listen(PORT, () => {
  console.log(`\n🎮 Signaling server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}\n`);
});
