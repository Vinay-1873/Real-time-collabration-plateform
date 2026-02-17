import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Version from '../models/Version.js';

// Store active connections per document
const documentConnections = new Map();

export const setupDocumentSocket = (io) => {
  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }

      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userName} (${socket.userId})`);

    // Join document room
    socket.on('join-document', async (docId) => {
      try {
        // Verify document access
        const document = await Document.findById(docId);
        
        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        if (!document.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join room
        socket.join(docId);
        socket.currentDocId = docId;

        // Track connection
        if (!documentConnections.has(docId)) {
          documentConnections.set(docId, new Set());
        }
        documentConnections.get(docId).add(socket.userId);

        // Notify others about new user
        const activeUsers = Array.from(documentConnections.get(docId));
        io.to(docId).emit('users-update', {
          count: activeUsers.length,
          users: activeUsers
        });

        console.log(`📄 User ${socket.userName} joined document ${docId}`);
      } catch (error) {
        console.error('Join document error:', error);
        socket.emit('error', { message: 'Error joining document' });
      }
    });

    // Handle document changes
    socket.on('send-changes', async (data) => {
      try {
        const { docId, delta } = data;

        if (!socket.currentDocId || socket.currentDocId !== docId) {
          socket.emit('error', { message: 'Not in document room' });
          return;
        }

        // Broadcast changes to all other users in the room
        socket.to(docId).emit('receive-changes', {
          delta,
          userId: socket.userId,
          userName: socket.userName
        });
      } catch (error) {
        console.error('Send changes error:', error);
      }
    });

    // Handle document save
    socket.on('save-document', async (data) => {
      try {
        const { docId, content } = data;

        if (!socket.currentDocId || socket.currentDocId !== docId) {
          socket.emit('error', { message: 'Not in document room' });
          return;
        }

        // Update document in database
        const document = await Document.findById(docId);
        
        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        if (!document.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        document.content = content;
        document.updatedAt = Date.now();
        await document.save();

        // Create version snapshot
        await Version.createVersion(docId, content, socket.userId);

        // Notify user of successful save
        socket.emit('save-success', {
          savedAt: document.updatedAt,
          message: 'Document saved successfully'
        });

        console.log(`💾 Document ${docId} saved by ${socket.userName}`);
      } catch (error) {
        console.error('Save document error:', error);
        socket.emit('save-error', { message: 'Error saving document' });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-update', (data) => {
      try {
        const { docId, position } = data;

        if (!socket.currentDocId || socket.currentDocId !== docId) {
          return;
        }

        socket.to(docId).emit('cursor-change', {
          userId: socket.userId,
          userName: socket.userName,
          position
        });
      } catch (error) {
        console.error('Cursor update error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      try {
        console.log(`❌ User disconnected: ${socket.userName}`);

        if (socket.currentDocId) {
          const docId = socket.currentDocId;
          
          // Remove from active connections
          if (documentConnections.has(docId)) {
            documentConnections.get(docId).delete(socket.userId);
            
            const activeUsers = Array.from(documentConnections.get(docId));
            
            // Clean up empty sets
            if (activeUsers.length === 0) {
              documentConnections.delete(docId);
            }

            // Notify remaining users
            io.to(docId).emit('users-update', {
              count: activeUsers.length,
              users: activeUsers
            });
          }
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });
};
