const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      userType: user.userType 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = { generateToken };