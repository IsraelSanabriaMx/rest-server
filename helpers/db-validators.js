const Role = require('../models/roles');
const User = require('../models/user');

const roleValidator = async (role = '') => {
  const exists = await Role.findOne({ role });

  if (!exists) {
    throw new Error(`The role ${role} is not defined on DB`);
  }
};

const emailDuplicated = async (email = '') => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error(`The email: ${email} is already recorded`);
  }
};

const validateId = async (id = '') => {
  const exists = await User.findById(id);

  if (!exists) {
    throw new Error(`The ID: ${id} does not exists`);
  }
};

module.exports = {
  roleValidator,
  emailDuplicated,
  validateId,
};