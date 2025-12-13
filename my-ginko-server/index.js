import express from 'express';
import { router } from './src/router/index.js';
import 'dotenv/config';
import { Db } from './src/db/index.js';
import { UsersModel } from './src/models/users/index.js';
import { AuthController } from './src/controller/auth/index.js';
import { SecurityController } from './src/controller/security/index.js';
import { TransactionController } from './src/controller/transaction/index.js';
import { SecurityModel } from './src/models/security/index.js';
import cors from 'cors';
import { TransactionsModel } from './src/models/transactions/index.js';

const db = new Db();
const app = express();
const port = process.env.PORT || 3000;

const users = new UsersModel(db);
const security = new SecurityModel(db);
const transaction = new TransactionsModel(db);

const authController = new AuthController(users);
const securityController = new SecurityController(security);
const transactionController = new TransactionController(transaction);

await db.init();

await db.createTable();

const allowedOrigins = [
  // 'http://localhost:8888',
  'http://localhost:2000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () =>
  console.log('my-ginko server is running on port ' + port)
);

app.use(
  router(
    {
      authController,
      securityController,
      transactionController,
    },
    {
      usersModel: users,
      securityModel: security,
    }
  )
);
