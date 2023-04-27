const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const filters = {
    status: true,
  };

  const [total, products] = await Promise.all([
    Product.countDocuments(filters),
    Product.find(filters)
      .skip(Number(from))
      .limit(Number(limit))
      .populate('user', 'name')
      .populate('category', 'name'),
  ]);

  res.json({
    total,
    products,
  });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.json({
    product,
  });
};

const createProduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({ name });

  if (productDB) {
    return res.status(400).json({
      msg: `The product: ${name} already exists`,
    });
  }

  try {
    const { category, price, description, available } = req.body;

    const data = {
      name,
      user: req.userAuthenticated._id,
      category,
      price,
      description,
      available,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json({
      product,
    });
  } catch (err) {
    res.status(400).json({
      msg: err,
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({ name });

  if (productDB) {
    if (id !== productDB._id.valueOf()) {
      return res.status(400).json({
        msg: 'The product name is already on DB',
      });
    }
  }

  try {
    const { category, price, description, available } = req.body;

    const data = {
      name,
      user: req.userAuthenticated._id,
      category,
      price,
      description,
      available,
      status: true,
    };

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
      product,
    });
  } catch (err) {
    res.status(400).json({
      msg: err,
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, {
    status: false,
    user: req.userAuthenticated._id,
  }, { new: true });

  res.json({
    product,
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}