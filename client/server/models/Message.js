import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add index for faster queries
messageSchema.index({ document: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
