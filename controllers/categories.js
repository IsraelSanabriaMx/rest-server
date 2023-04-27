const { request, response } = require('express');
const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const filters = {
    status: true,
  };

  const [total, categories] = await Promise.all([
    Category.countDocuments(filters),
    Category.find(filters)
      .skip(Number(from))
      .limit(Number(limit))
      .populate('user', 'name'),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('user', 'name');

  res.json({
    category,
  });
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `The category: ${name} already exists`,
    });
  }

  try {
    const data = {
      name,
      user: req.userAuthenticated._id,
    };

    const category = new Category(data);
    await category.save();

    res.status(201).json({
      category,
    });

  } catch (err) {
    res.status(400).json({
      msg: err,
    });
  }
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    if (id !== categoryDB._id.valueOf()) {
      return res.status(400).json({
        msg: 'The category name is already on DB',
      });
    }
  }

  const data = {
    name,
    user: req.userAuthenticated._id,
    status: true,
  };

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json({
    category,
  });
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, {
    status: false,
    user: req.userAuthenticated._id,
  }, { new: true });

  res.json({
    category,
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  updateCategory,
  createCategory,
  deleteCategory,
}