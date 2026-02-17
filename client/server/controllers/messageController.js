import Message from '../models/Message.js';
import Document from '../models/Document.js';

// Get messages for a document
export const getMessages = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Verify access to document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const hasAccess = document.owner.toString() === req.userId ||
                      document.collaborators.some(c => c.user.toString() === req.userId) ||
                      document.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get messages
    const messages = await Message.find({ document: documentId })
      .populate('sender', 'username email avatar')
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
