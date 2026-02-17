import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import { connectDB } from './config/database.js';
import { initializeSocket } from './socket/socketHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', io);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Real-time Collaboration Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      documents: '/api/documents',
      files: '/api/files',
      messages: '/api/messages'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

export default app;
