import express from 'express';
import {
  createDocument,
  getUserDocuments,
  getDocumentById,
  updateDocument,
  getDocumentVersions,
  restoreVersion,
  deleteDocument,
  addCollaborator,
  removeCollaborator
} from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/create', createDocument);
router.get('/user/all', getUserDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.get('/:id/versions', getDocumentVersions);
router.post('/:id/restore/:versionId', restoreVersion);
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:userId', removeCollaborator);

export default router;
