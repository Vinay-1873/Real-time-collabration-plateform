import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  getVersions,
  restoreVersion
} from '../controllers/documentController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Document CRUD
router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

// Collaborators
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators', removeCollaborator);

// Version control
router.get('/:id/versions', getVersions);
router.post('/:id/restore', restoreVersion);

export default router;
