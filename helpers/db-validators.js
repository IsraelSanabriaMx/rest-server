const { Role, Category, Product } = require('../models');
const { User } = require('../models');

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

const validateUserId = async (id = '') => {
  const exists = await User.findById(id);

  if (!exists) {
    throw new Error(`The ID: ${id} does not exists`);
  }
};

const validateCategoryId = async (id = '') => {
  const exists = await Category.findById(id);

  if (!exists) {
    throw new Error(`The ID: ${id} does not exists`);
  }
};

const validateProductId = async (id = '') => {
  const exists = await Product.findById(id);

  if (!exists) {
    throw new Error(`The ID: ${id} does not exists`);
  }
};

module.exports = {
  roleValidator,
  emailDuplicated,
  validateUserId,
  validateCategoryId,
  validateProductId,
};