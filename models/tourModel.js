const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tourScheme = Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required!'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour duration is required!'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour group size is required!'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour difficulty is required!'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    validate: {
      validator: function (v) {
        return typeof v !== 'Number';
      },
      message: (props) => `${props.value} is not number, it's a string!`,
      // message: (props) => `${props.value} is not a valid price!`,
    },
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    validate: {
      validator: function (v) {
        return typeof v !== 'Number';
      },
      message: (props) => `${props.value} is not number, it's a string!`,
      // message: (props) => `${props.value} is not a valid price!`,
    },
    required: [true, 'Tour price is required!'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour summar is required!'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour image is required!'],
  },
  images: [String],
  createdAt: { 
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = model('Tour', tourScheme);

module.exports = Tour;
