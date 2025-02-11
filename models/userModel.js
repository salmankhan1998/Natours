const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, model } = mongoose;

const userSchema = Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxLength: [30, 'A user name can only be 30 character long'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'A user must have an email'],
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    unique: true,
    required: [true, 'A user must have a pasword'],
    minLength: [8, 'A password must have at least 8 characters.'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user password should match'],
  },
});

const User = model('User', userSchema);

module.exports = User;
