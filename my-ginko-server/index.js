const express = require('express');
const env = require('dotenv');

env.config();

const port = process.env.PORT;

const app = express();

console.log(port);

app.get('/', (req, res) => {
  res.send('Hello World! From PORT:' + port);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
