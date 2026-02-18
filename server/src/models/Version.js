import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
versionSchema.index({ documentId: 1, savedAt: -1 });

// Limit version history to last 50 versions per document
versionSchema.statics.createVersion = async function(documentId, content, userId) {
  // Create new version
  const version = await this.create({
    documentId,
    content,
    savedBy: userId
  });

  // Keep only last 50 versions
  const versions = await this.find({ documentId })
    .sort({ savedAt: -1 })
    .skip(50);

  if (versions.length > 0) {
    const idsToDelete = versions.map(v => v._id);
    await this.deleteMany({ _id: { $in: idsToDelete } });
  }

  return version;
};

const Version = mongoose.model('Version', versionSchema);

export default Version;
