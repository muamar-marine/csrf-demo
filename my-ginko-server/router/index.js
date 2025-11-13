import { Router } from 'express';
import { authRouter } from './auth/index.js';
import { transactionRouter } from './transaction/index.js';
import { securityRouter } from './security/index.js';

const r = Router();

r.get('/', (_, res) => res.status(200).json({ message: 'Hello, world!;' }));
r.use('/auth', authRouter);
r.use(
  '/transaction',
  (req, res, next) => {
    // Do middleware
    next();
  },
  transactionRouter
);
r.use(
  '/security',
  (req, res, next) => {
    // Do middleware
    next();
  },
  securityRouter
);

export { r as router };
