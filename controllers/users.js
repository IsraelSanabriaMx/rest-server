const { request, response } = require('express');

const usersGet = (req = request, res = response) => {
  const { page = '1', limit } = req.query;
  res.json({
    msg: 'GET - Controller',
    page,
    limit,
  });
};

const usersPut = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: 'PUT - Controller',
    id,
  });
};

const usersPost = (req = request, res = response) => {
  const { name, age } = req.body;

  res.json({
    msg: 'POST - Controller',
    name,
    age,
  });
};

const usersDelete = (req = request, res = response) => {
  res.json({
    msg: 'DELETE - Controller',
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
};