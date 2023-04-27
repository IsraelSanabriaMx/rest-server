require('dotenv').config();

const { Server } = require('./models');

const sever = new Server();

sever.listen();