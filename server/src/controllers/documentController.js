import Document from '../models/Document.js';
import Version from '../models/Version.js';
import mongoose from 'mongoose';

// @desc    Create new document
// @route   POST /api/docs/create
// @access  Private
export const createDocument = async (req, res) => {
  try {
    const { title } = req.body;

    const document = await Document.create({
      title: title || 'Untitled Document',
      ownerId: req.user._id,
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      }
    });

    // Create initial version
    await Version.createVersion(
      document._id,
      document.content,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: 'Document created successfully.',
      data: { document }
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating document.'
    });
  }
};

// @desc    Get all user documents
// @route   GET /api/docs/user/all
// @access  Private
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get documents where user is owner OR collaborator
    const documents = await Document.find({
      $or: [
        { ownerId: userId },           // Documents owned by user
        { collaborators: userId }      // Documents where user is a collaborator
      ]
    })
      .populate('ownerId', 'name email')
      .populate('collaborators', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching documents.'
    });
  }
};

// @desc    Get document by ID
// @route   GET /api/docs/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.'
      });
    }

    const document = await Document.findById(id)
      .populate('ownerId', 'name email')
      .populate('collaborators', 'name email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Check access permission - user must be owner or collaborator
    if (!document.hasAccess(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this document.'
      });
    }

    res.status(200).json({
      success: true,
      data: { document }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching document.'
    });
  }
};

// @desc    Update document
// @route   PUT /api/docs/:id
// @access  Private
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, collaborators } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Check access permission
    if (!document.hasAccess(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to edit this document.'
      });
    }

    // Update fields
    if (title !== undefined) {
      document.title = title;
    }
    
    if (content !== undefined) {
      document.content = content;
    }

    // Only owner can update collaborators
    if (collaborators !== undefined && document.ownerId.toString() === req.user._id.toString()) {
      document.collaborators = collaborators;
    }

    document.updatedAt = Date.now();
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Document updated successfully.',
      data: { document }
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating document.'
    });
  }
};

// @desc    Get document versions
// @route   GET /api/docs/:id/versions
// @access  Private
export const getDocumentVersions = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Check access permission
    if (!document.hasAccess(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const versions = await Version.find({ documentId: id })
      .populate('savedBy', 'name email')
      .sort({ savedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: { versions }
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching versions.'
    });
  }
};

// @desc    Restore document version
// @route   POST /api/docs/:id/restore/:versionId
// @access  Private
export const restoreVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(versionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document or version ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Check access permission
    if (!document.hasAccess(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const version = await Version.findById(versionId);

    if (!version || version.documentId.toString() !== id) {
      return res.status(404).json({
        success: false,
        message: 'Version not found.'
      });
    }

    // Restore content
    document.content = version.content;
    document.updatedAt = Date.now();
    await document.save();

    // Create new version after restore
    await Version.createVersion(
      document._id,
      document.content,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Version restored successfully.',
      data: { document }
    });
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error restoring version.'
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/docs/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Only owner can delete
    if (document.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete this document.'
      });
    }

    await Document.findByIdAndDelete(id);
    await Version.deleteMany({ documentId: id });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully.'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting document.'
    });
  }
};

// @desc    Add collaborator to document
// @route   POST /api/docs/:id/collaborators
// @access  Private
export const addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document or user ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Check if user is already a collaborator or owner
    if (document.ownerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'User is already the owner of this document.'
      });
    }

    if (document.collaborators.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator.'
      });
    }

    // Add collaborator
    document.collaborators.push(userId);
    await document.save();

    // Populate and return
    await document.populate('collaborators', 'name email');

    res.status(200).json({
      success: true,
      message: 'Collaborator added successfully.',
      data: { document }
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding collaborator.'
    });
  }
};

// @desc    Remove collaborator from document
// @route   DELETE /api/docs/:id/collaborators/:userId
// @access  Private
export const removeCollaborator = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document or user ID.'
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }

    // Remove collaborator
    document.collaborators = document.collaborators.filter(
      collaboratorId => collaboratorId.toString() !== userId
    );
    
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully.',
      data: { document }
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing collaborator.'
    });
  }
};
