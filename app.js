const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// this Middleware add the data send in api req into req.body
app.use(express.json());
app.use((req, res, next) => {
  // Put date for every request into request object
  req.requestTime = new Date().toISOString();
  next();
});
app.use(express.static(`${__dirname}/public`));

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
