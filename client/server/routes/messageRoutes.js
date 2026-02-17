import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getMessages, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get messages for a document
router.get('/:documentId', getMessages);

// Delete a message
router.delete('/:id', deleteMessage);

export default router;
