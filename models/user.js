const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Is required'],
  },
  email: {
    type: String,
    required: [true, 'Is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'Is required'],
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();

  return user;
}

module.exports = model('User', UserSchema);