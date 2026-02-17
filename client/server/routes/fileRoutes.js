import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Upload file
router.post('/upload', upload.single('file'), uploadFile);

// Get files
router.get('/', getFiles);

// Delete file
router.delete('/:id', deleteFile);

export default router;
