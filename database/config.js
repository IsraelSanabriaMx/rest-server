const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log('Connection success');
  } catch (err) {
    console.log('Error: ', err);
    throw new Error('DB is not responding');
  }
};

module.exports = {
  connect,
};