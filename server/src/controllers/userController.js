import User from '../models/User.js';

// @desc    Get all users (for sharing documents)
// @route   GET /api/users/all
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('_id name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users.'
    });
  }
};
