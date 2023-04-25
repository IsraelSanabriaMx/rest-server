const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(payload, process.env.SECRET, {
      expiresIn: '4h',
    }, (err, token) => {
      if (err) {
        reject('Token could not be generated');
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  generateJWT
}