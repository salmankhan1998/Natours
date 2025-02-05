const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema, model } = mongoose;
const tourScheme = Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required!'],
      unique: true,
      minLength: [10, 'Tour name must have at least 10 characters.'],
      maxLength: [40, 'Tour name can only have 40 characters at most.'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty can only have one of these value: easy, medium and difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Average rating must be above 1.0.'],
      max: [5, 'Average rating must be below 5.'],
      //Custom Validator
      validate: {
        validator: function (v) {
          return typeof v !== 'Number' ? false : true;
        },
        message: (props) => `${props.value} must be type Number, not a String!`,
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
          return typeof v !== 'Number' ? false : true;
        },
        message: (props) => `${props.value} must be type Number, not a String!`,
        // message: (props) => `${props.value} is not a valid price!`,
      },
      required: [true, 'Tour price is required!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < this.price;
        },
        message: (props) =>
          `Discunt price (${props.value}) must be lower than the actual price.`,
        // message: (props) => `${props.value} is not a valid price!`,
      },
      required: [true, 'Tour price is required!'],
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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
//Runs before .save() and .create() but not update()
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

// QUERY MIDDLEWARE
tourScheme.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourScheme.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start}`);
  next();
});

// AGGREGATION MIDDLEWARE
// Applied to any aggregation pipeline of a tour api end-point
tourScheme.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = model('Tour', tourScheme);

module.exports = Tour;
