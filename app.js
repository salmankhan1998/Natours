const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;

// this line of code add the data send in api req into req.body
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/assets/data/tours-simple.json`)
);

//API end-point for getting all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//API end-point for creating a new tours
app.post('/api/v1/tours', (req, res) => {
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
});

//API end-point for getting tour by ID
app.get('/api/v1/tours/:id', (req, res) => {
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
});

//API end-point for updating tour by ID
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

//API end-point for deleting tour by ID
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello, I am listening to get requests', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello , I am listening to post requests',
//     app: 'natours',
//   });
// });
