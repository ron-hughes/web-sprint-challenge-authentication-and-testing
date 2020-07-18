const jwt= require('jsonwebtoken');
const {jwtSec}= require('../config/security');

module.exports = {
  generateToken
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, jwtSec, options);
}//end generateToken