const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// GET -> Read all Users -> /api/v1/users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  });
};
