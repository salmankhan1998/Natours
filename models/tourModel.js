const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tourScheme = Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required!'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: String,
    required: [true, 'Tour price is required!'],
  },
});

const Tour = model('Tour', tourScheme);

module.exports = Tour;
