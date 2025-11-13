import express from 'express';
import { router } from './router/index.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () =>
  console.log('my-ginko server is running on port ' + port)
);

app.use(router);
