import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Document from '../models/Document.js';
import Message from '../models/Message.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Store active connections
  const activeUsers = new Map(); // documentId -> Set of { userId, socketId, username }
  const documentRooms = new Map(); // documentId -> Set of socketIds

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.id})`);

    // Join document room
    socket.on('join-document', async ({ documentId, username }) => {
      try {
        // Verify access to document
        const document = await Document.findById(documentId);
        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        const hasAccess = document.owner.toString() === socket.userId ||
                          document.collaborators.some(c => c.user.toString() === socket.userId) ||
                          document.isPublic;

        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join the room
        socket.join(documentId);
        socket.currentDocument = documentId;

        // Track active users
        if (!activeUsers.has(documentId)) {
          activeUsers.set(documentId, new Set());
        }
        if (!documentRooms.has(documentId)) {
          documentRooms.set(documentId, new Set());
        }

        activeUsers.get(documentId).add({
          userId: socket.userId,
          socketId: socket.id,
          username
        });
        documentRooms.get(documentId).add(socket.id);

        // Send current active users to the joining user
        const users = Array.from(activeUsers.get(documentId));
        socket.emit('active-users', users);

        // Notify others about new user
        socket.to(documentId).emit('user-joined', {
          userId: socket.userId,
          username,
          socketId: socket.id
        });

        console.log(`User ${username} joined document ${documentId}`);
      } catch (error) {
        console.error('Join document error:', error);
        socket.emit('error', { message: 'Failed to join document' });
      }
    });

    // Handle document editing
    socket.on('document-change', async ({ documentId, content, cursorPosition }) => {
      try {
        // Broadcast changes to other users in the room
        socket.to(documentId).emit('document-update', {
          content,
          userId: socket.userId,
          cursorPosition
        });

        // Save to database (debounced on client side)
        await Document.findByIdAndUpdate(documentId, {
          content,
          lastModified: Date.now()
        });
      } catch (error) {
        console.error('Document change error:', error);
      }
    });

    // Handle cursor position updates
    socket.on('cursor-position', ({ documentId, position, username }) => {
      socket.to(documentId).emit('cursor-update', {
        userId: socket.userId,
        username,
        position
      });
    });

    // Handle text selection
    socket.on('text-selection', ({ documentId, selection, username }) => {
      socket.to(documentId).emit('selection-update', {
        userId: socket.userId,
        username,
        selection
      });
    });

    // Handle chat messages
    socket.on('send-message', async ({ documentId, content }) => {
      try {
        const message = new Message({
          document: documentId,
          sender: socket.userId,
          content,
          type: 'text'
        });

        await message.save();
        await message.populate('sender', 'username email avatar');

        // Broadcast message to all users in the document
        io.to(documentId).emit('new-message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ documentId, username }) => {
      socket.to(documentId).emit('user-typing', {
        userId: socket.userId,
        username
      });
    });

    socket.on('stop-typing', ({ documentId }) => {
      socket.to(documentId).emit('user-stop-typing', {
        userId: socket.userId
      });
    });

    // Leave document room
    socket.on('leave-document', ({ documentId, username }) => {
      handleUserLeave(socket, documentId, username);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId} (${socket.id})`);
      
      if (socket.currentDocument) {
        handleUserLeave(socket, socket.currentDocument, 'User');
      }
    });

    // Helper function to handle user leaving
    function handleUserLeave(socket, documentId, username) {
      socket.leave(documentId);

      if (activeUsers.has(documentId)) {
        const users = activeUsers.get(documentId);
        const userArray = Array.from(users);
        const updatedUsers = userArray.filter(u => u.socketId !== socket.id);
        
        if (updatedUsers.length === 0) {
          activeUsers.delete(documentId);
          documentRooms.delete(documentId);
        } else {
          activeUsers.set(documentId, new Set(updatedUsers));
        }
      }

      if (documentRooms.has(documentId)) {
        documentRooms.get(documentId).delete(socket.id);
        if (documentRooms.get(documentId).size === 0) {
          documentRooms.delete(documentId);
        }
      }

      // Notify others about user leaving
      socket.to(documentId).emit('user-left', {
        userId: socket.userId,
        username,
        socketId: socket.id
      });

      console.log(`User ${username} left document ${documentId}`);
    }
  });

  return io;
};
