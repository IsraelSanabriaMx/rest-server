const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const User = require('../models/user');

const validateJwt = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'Not token present on the request',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET);

    const authenticated = await User.findById(uid);

    if (!authenticated.status) {
      return res.status(401).json({
        msg: 'User authenticated not valid',
      });
    }

    req.userAuthenticated = authenticated;

    next();
  } catch (err) {
    return res.status(401).json({
      msg: 'Not valid token',
    });
  }
}

module.exports = {
  validateJwt,
}