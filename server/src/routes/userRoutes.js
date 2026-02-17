import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/all', getAllUsers);

export default router;
