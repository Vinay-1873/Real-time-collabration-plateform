import cloudinary from '../config/cloudinary.js';
import File from '../models/File.js';
import { Readable } from 'stream';

// Upload file to Cloudinary
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentId } = req.body;

    // Convert buffer to stream
    const stream = Readable.from(req.file.buffer);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'collaboration-platform',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Save file info to database
    const file = new File({
      filename: result.public_id,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.userId,
      document: documentId || null
    });

    await file.save();
    await file.populate('uploadedBy', 'username email avatar');

    res.status(201).json({
      message: 'File uploaded successfully',
      file
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all files for a user
export const getFiles = async (req, res) => {
  try {
    const { documentId } = req.query;
    const query = { uploadedBy: req.userId };
    
    if (documentId) {
      query.document = documentId;
    }

    const files = await File.find(query)
      .populate('uploadedBy', 'username email avatar')
      .sort({ createdAt: -1 });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user owns the file
    if (file.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
