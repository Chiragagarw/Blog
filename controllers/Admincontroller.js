const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from selection

    res.json({status:200, message: "get all", Data: users});
  } catch (error) {
    console.error(error.message);
    res.status(500).send({status:500, message:'Server Error', error});
  }
};

// DELETE user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({status:201, msg: 'User deleted successfully', Data: user });
  } catch (error) {
    console.error({status: 401, message: "error ",error});

    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(500).send('Server Error');
  }
};
