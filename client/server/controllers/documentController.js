import Document from '../models/Document.js';
import User from '../models/User.js';

// Create new document
export const createDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    const document = new Document({
      title,
      content: content || '',
      owner: req.userId,
      isPublic: isPublic || false,
      versions: [{
        content: content || '',
        modifiedBy: req.userId,
        versionNumber: 1
      }]
    });

    await document.save();
    await document.populate('owner', 'username email avatar');

    res.status(201).json({
      message: 'Document created successfully',
      document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all documents for current user
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar')
    .sort({ lastModified: -1 });

    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single document
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'username email avatar')
      .populate('collaborators.user', 'username email avatar')
      .populate('versions.modifiedBy', 'username email avatar');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access
    const hasAccess = document.owner._id.toString() === req.userId ||
                      document.collaborators.some(c => c.user._id.toString() === req.userId) ||
                      document.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has edit permission
    const isOwner = document.owner.toString() === req.userId;
    const collaborator = document.collaborators.find(c => c.user.toString() === req.userId);
    const hasEditPermission = isOwner || (collaborator && ['edit', 'admin'].includes(collaborator.permission));

    if (!hasEditPermission) {
      return res.status(403).json({ message: 'You do not have permission to edit this document' });
    }

    // Save current version if content changed
    if (content && content !== document.content) {
      document.versions.push({
        content: document.content,
        modifiedBy: req.userId,
        versionNumber: document.currentVersion
      });
      document.currentVersion += 1;
      document.content = content;
    }

    if (title) document.title = title;
    if (isPublic !== undefined) document.isPublic = isPublic;
    document.lastModified = Date.now();

    await document.save();
    await document.populate('owner', 'username email avatar');
    await document.populate('collaborators.user', 'username email avatar');

    res.json({ message: 'Document updated successfully', document });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can delete
    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only owner can delete this document' });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add collaborator
export const addCollaborator = async (req, res) => {
  try {
    const { userId, permission } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if requester is owner or admin
    const isOwner = document.owner.toString() === req.userId;
    const collaborator = document.collaborators.find(c => c.user.toString() === req.userId);
    const hasAdminPermission = isOwner || (collaborator && collaborator.permission === 'admin');

    if (!hasAdminPermission) {
      return res.status(403).json({ message: 'You do not have permission to add collaborators' });
    }

    // Check if user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a collaborator
    if (document.collaborators.some(c => c.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    document.collaborators.push({
      user: userId,
      permission: permission || 'view'
    });

    await document.save();
    await document.populate('collaborators.user', 'username email avatar');

    res.json({ message: 'Collaborator added successfully', document });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove collaborator
export const removeCollaborator = async (req, res) => {
  try {
    const { userId } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can remove collaborators
    if (document.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only owner can remove collaborators' });
    }

    document.collaborators = document.collaborators.filter(
      c => c.user.toString() !== userId
    );

    await document.save();
    res.json({ message: 'Collaborator removed successfully', document });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get document versions
export const getVersions = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('versions.modifiedBy', 'username email avatar');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check access
    const hasAccess = document.owner.toString() === req.userId ||
                      document.collaborators.some(c => c.user.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ versions: document.versions });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Restore document to specific version
export const restoreVersion = async (req, res) => {
  try {
    const { versionNumber } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check edit permission
    const isOwner = document.owner.toString() === req.userId;
    const collaborator = document.collaborators.find(c => c.user.toString() === req.userId);
    const hasEditPermission = isOwner || (collaborator && ['edit', 'admin'].includes(collaborator.permission));

    if (!hasEditPermission) {
      return res.status(403).json({ message: 'You do not have permission to restore versions' });
    }

    // Find the version
    const version = document.versions.find(v => v.versionNumber === versionNumber);
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Save current state before restoring
    document.versions.push({
      content: document.content,
      modifiedBy: req.userId,
      versionNumber: document.currentVersion
    });

    // Restore version
    document.content = version.content;
    document.currentVersion += 1;
    document.lastModified = Date.now();

    await document.save();
    await document.populate('owner', 'username email avatar');

    res.json({ message: 'Version restored successfully', document });
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
