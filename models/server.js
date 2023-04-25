const express = require('express');
var cors = require('cors');
const { connect } = require('../database/config');

const PATH = '/api';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = `${PATH}/users`;
    this.authPath = `${PATH}/auth`;

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
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.usersPath, require('../routes/user'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    });
  }
};

module.exports = Server;