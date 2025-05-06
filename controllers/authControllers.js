const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const generateJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { body } = req;

  const newUser = await User.create({
    ...body,
  });
  //  name: body.name,
  //   email: body.email,
  //   password: body.password,
  //   passwordConfirm: body.passwordConfirm,
  //   passwordChangedAt: body.passwordChangedAt,
  //   role: body.role,

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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Find User by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('User does not exist with this email.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send reset tokem to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)!',
      resetUrl,
      resetToken,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to mail',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        'An error occured during sending the mail, try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const token = req.params.token;
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // 2) If user exists and token not expired then set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  // 3) Update PasswordChangedAt property for user
  //This is implemented through Mongoose middleware on pre save

  // 4) Log in the user and Send JWT token
  const newToken = generateJWTToken(user._id);

  res.status(200).json({
    status: 'success',
    token: newToken,
  });
});
