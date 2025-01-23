const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

const { Schema, model } = mongoose;
// Set Environment for dev and prod
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log('Database connected successfully');
});

const port = process.env.PORT || 3000;

const tourScheme = Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required!'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: String,
    required: [true, 'Tour price is required!'],
  },
});

const Tour = model('Tour', tourScheme);

const newTour = new Tour({
  name: 'The Forest Camping',
  price: 599,
});

newTour
  .save()
  .then((doc) => {
    console.log('Tour added:', doc);
  })
  .catch((err) => {
    console.log('ERROR:', err);
  });

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
