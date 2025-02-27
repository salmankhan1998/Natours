const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join('.');
  const message = `Validation error: ${errors}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid Token. Please log in.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  // Operational, trust error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknow error: don't leak error details
  } else {
    // 1) Log the error
    console.error('ERROR:', err);

    // 2) Send generic error
    res.status(500).json({
      status: 'error',
      message: 'Opss, something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // let error = { ...err };
    console.log('err', err);

    sendDevError(err, res);
    // sendProdError(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed')
      error = handleValidateErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProdError(error, res);
  }
};
