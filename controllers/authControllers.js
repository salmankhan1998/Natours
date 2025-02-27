const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const generateJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { body } = req;

  const newUser = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    passwordChangedAt: body.passwordChangedAt,
  });

  const token = generateJWTToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        `Please provide valid ${!email ? 'email' : 'password'}.`,
        400,
      ),
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Password is incorrect', 401));
  }
  const token = generateJWTToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Getting Token and Checking if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('User is not logged in.', 401));
  }

  //2. Verification Token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if User still exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this toekn does not exist.', 401),
    );
  }

  //4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        'User recently changed their password. Please log in again.',
        401,
      ),
    );
  }

  req.user = currentUser;
  next();
});
