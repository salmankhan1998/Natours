const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../assets/data/tours-simple.json`)
);

// Middleware to check Id exist or not just before the handler runs
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  const id = val * 1; //Coverts String to Number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;

  if (!name || !price) {
    return res.status(400).json({
      status: 'request failed',
      message: `Name and price does not exist`,
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  const requestTime = req.requestTime;
  res.status(200).json({
    status: 'success',
    requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../assets/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1; //Coverts String to Number
  // console.log(req);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
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
