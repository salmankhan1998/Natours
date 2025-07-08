const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp'); 

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ----------------------- Middleware ----------------------------

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Api Limiting using express-rate-limit for denail of service(DoS) and brurte force attack
const limiter = rateLimit({
  max: 100, //Maximum number of requests
  windowMs: 60 * 60 * 1000, //Expire in 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
// this Middleware add the data send in api req into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

//Serving static files
app.use(express.static(`${__dirname}/public`));

//
app.use((req, res, next) => {
  // Put date for every request into request object
  req.requestTime = new Date().toISOString();
  next();
});

// Mounting Router To Path
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Mounting a general router for all
// other wrong url paths
app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `Invalid! Can't find ${req.originalUrl} on this server!`,
  // );
  // err.status = 'failed';
  // err.statusCode = 404;
  next(
    new AppError(`Invalid! Can't find ${req.originalUrl} on this server!`, 404),
  );
});

// Global Error Handle Middleware Function
app.use(globalErrorHandler);

module.exports = app;

//API end-point for getting all tours
// app.get('/api/v1/tours', getAllTours);
//API end-point for creating a new tours
// app.post('/api/v1/tours', createTour);
//API end-point for getting tour by ID
// app.get('/api/v1/tours/:id', getTour);
//API end-point for updating tour by ID
// app.patch('/api/v1/tours/:id', updateTour);
//API end-point for deleting tour by ID
// app.delete('/api/v1/tours/:id', deleteTour);
