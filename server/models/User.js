const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: [true, 'Email is required to signuop'],
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '${VALUE} is not a valid email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: 6,
    trim: true,
  },
});

module.exports = { User };
