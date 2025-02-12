const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.signUp = catchAsync(async (req, res, next) => {
  const { body } = req;

  const newUser = await User.create(body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
