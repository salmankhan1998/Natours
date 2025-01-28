const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel.js');

// Set Environment for dev and prod
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log('Database connected successfully');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

//Import Data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteDate = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data delated successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteDate();
}
