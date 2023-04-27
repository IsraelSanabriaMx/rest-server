const express = require('express');
var cors = require('cors');
const { connect } = require('../database/config');

const PATH = '/api';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: `${PATH}/auth`,
      categories: `${PATH}/categories`,
      products: `${PATH}/products`,
      search: `${PATH}/search`,
      users: `${PATH}/users`,
    };

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {
    await connect();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.categories, require('../routes/categories'));
    this.app.use(this.paths.products, require('../routes/products'));
    this.app.use(this.paths.search, require('../routes/search'));
    this.app.use(this.paths.users, require('../routes/user'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    });
  }
};

module.exports = Server;