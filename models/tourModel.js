const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema, model } = mongoose;
const tourScheme = Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required!'],
      unique: true,
    },
    slug: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//Defining a virtual for tour scheme which is not
// be saved in DB but will be displayed when data
// is output from DB and sent to client
tourScheme.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
//Runs before .save() and .create()
tourScheme.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourScheme.pre('save', function (next) {
  // console.log('Mongoose pre Middleware hook');
  next();
});

tourScheme.post('save', function (document, next) {
  // console.log('current document:', document);
  next();
});

const Tour = model('Tour', tourScheme);

module.exports = Tour;
