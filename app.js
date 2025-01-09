const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello, I am listening to get requests', app: 'natours' });
});

app.post('/', (req, res) => {
  res.status(200).json({
    message: 'Hello , I am listening to post requests',
    app: 'natours',
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
