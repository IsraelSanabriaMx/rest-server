const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const { User, Category, Product } = require('../models');

const collections = [
  'CATEGORIES',
  'PRODUCTS',
  'ROLES',
  'USERS',
];

const seachCategories = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regexp = new RegExp(term, 'i');

  const categories = await Category.find({ name: regexp, status: true });

  res.json({
    results: categories ? categories : [],
  });
};

const seachProducts = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate('category', 'name');
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regexp = new RegExp(term, 'i');

  const products = await Product.find({
    $or: [
      { name: regexp },
      { description: regexp },
    ],
    $and: [
      { status: true }
    ]
  }).populate('category', 'name');

  res.json({
    results: products ? products : [],
  });
};

const seachUsers = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regexp = new RegExp(term, 'i');

  const users = await User.find({
    $or: [
      { name: regexp },
      { email: regexp },
    ],
    $and: [
      { status: true }
    ]
  });

  res.json({
    results: users ? users : [],
  });
};

const search = (req = request, res = response) => {
  const { collection = '', term = '' } = req.params;

  if (!collections.includes(collection.toUpperCase())) {
    return res.status(400).json({
      msg: `Collections allowed: ${collections}.`,
    });
  }

  switch (collection.toUpperCase()) {
    case collections[0]:
      seachCategories(term, res);
      break;
    case collections[1]:
      seachProducts(term, res);
      break;
    case collections[3]:
      seachUsers(term, res);
      break;
    default:
      return res.status(500).json({
        msg: `Collection ${collection} is not implemented.`,
      });
  }
};

module.exports = {
  search
}