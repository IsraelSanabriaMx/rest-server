const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { generateJWT, googleVerify } = require('../helpers');

const { User } = require('../models');

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

const googleSignIn = async (req = request, res = response) => {
  const { idToken } = req.body;

  try {
    const { name, img, email } = await googleVerify(idToken);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: 'foo',
        img,
        role: 'USER_ROLE',
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(400).json({
        msg: 'Blocked user',
      });
    }

    const token = await generateJWT(user._id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      msg: 'Google token not verified',
      err,
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};