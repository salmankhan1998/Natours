const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Set Environment for dev and prod
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log('Database connected successfully');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
