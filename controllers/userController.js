const fs = require('fs');

// HANDLE USERS
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
);
// GET -> Read all Users -> /api/v1/users
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};
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
