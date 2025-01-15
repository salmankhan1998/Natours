const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// 1) MIDDLEWARE
app.use(morgan('dev'));
// this Middleware add the data send in api req into req.body
app.use(express.json());
app.use((req, res, next) => {
  // Put date for every request into request object
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/assets/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
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

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/assets/data/tours-simple.json`,
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

const getTour = (req, res) => {
  const id = req.params.id * 1; //Coverts String to Number
  // console.log(req);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1; //Coverts String to Number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1; //Coverts String to Number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet defined!',
  });
};

// 3) ROUTER
// Creating Multiple Router For Each Resource
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Mounting Router To Path
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

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
