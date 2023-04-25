const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, status: true });

    if (!user) {
      return res.status(400).json({
        msg: 'User / Password is incorrect',
      });
    }

    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        msg: 'Password / User is incorrect',
      });
    }

    const token = await generateJWT(user._id);

    res.json({
      msg: 'login',
      user,
      token,
    });
  } catch (err) {
    console.log('Error: ', err);

    res.status(500).json({
      msg: 'Contact the administrator',
    });
  }
};

module.exports = {
  login,
};