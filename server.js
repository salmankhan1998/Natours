const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Should be called at the top level to catch
// the exception if but after code then exception
// is not catch at all.
process.on('uncaughtException', (err) => {
  console.log('Error:', err.name, '| Message:', err.message);
  process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Error:', err.name, '| Message:', err.message);
  server.close(() => {
    process.exit(1);
  });
});
