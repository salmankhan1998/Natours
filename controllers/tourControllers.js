const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  const requestTime = req.requestTime;
  res.status(200).json({
    status: 'success',
    requestTime,
    // results: tours.length,
    // data: {
    //   tours: tours,
    // },
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ------------------- Unused Code -----------------------

// Middleware to check Id exist or not just before the handler runs
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   const id = val * 1; //Coverts String to Number
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const name = req.body.name;
//   const price = req.body.price;

//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'request failed',
//       message: `Name and price does not exist`,
//     });
//   }
//   next();
// };
