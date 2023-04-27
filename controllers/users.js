const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');

const usersGet = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const filters = {
    status: true,
  };

  const [total, users] = await Promise.all([
    User.countDocuments(filters),
    User.find(filters)
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, email, ...rest } = req.body;

  if (password) {
    const bcryptPass = encryptPassword(password);
    rest.password = bcryptPass;
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    user,
  });
};

const encryptPassword = (password) => {
  const salt = bcryptjs.genSaltSync();

  return bcryptjs.hashSync(password, salt);
};

const usersPost = async (req = request, res = response) => {
  const user = new User(req.body);
  const bcryptPass = encryptPassword(user.password);
  user.password = bcryptPass;

  await user.save();

  res.status(201).json({
    user,
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Remove from DB
  // const user = await User.findByIdAndDelete(id);

  // Update status
  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    user,
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
};