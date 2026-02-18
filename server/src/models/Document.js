import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    default: 'Untitled Document'
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
documentSchema.index({ ownerId: 1 });
documentSchema.index({ collaborators: 1 });

// Method to check if user has access to document
documentSchema.methods.hasAccess = function(userId) {
  if (!userId) return false;
  
  const userIdStr = userId.toString();
  
  // Handle both populated and non-populated ownerId
  const ownerIdStr = this.ownerId?._id 
    ? this.ownerId._id.toString() 
    : this.ownerId?.toString();
  
  if (userIdStr === ownerIdStr) {
    return true;
  }
  
  // Check collaborators array
  if (!this.collaborators || this.collaborators.length === 0) {
    return false;
  }
  
  return this.collaborators.some(collaborator => {
    // Handle both populated and non-populated collaborators
    const collaboratorIdStr = collaborator?._id 
      ? collaborator._id.toString() 
      : collaborator?.toString();
    return collaboratorIdStr === userIdStr;
  });
};

const Document = mongoose.model('Document', documentSchema);

export default Document;
