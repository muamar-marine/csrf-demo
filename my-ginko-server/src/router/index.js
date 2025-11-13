import { Router } from 'express';
import { authRouter } from './auth/index.js';
import { transactionRouter } from './transaction/index.js';
import { securityRouter } from './security/index.js';
import { authenticate } from '../middlewares/auth/index.js';

/**
 *
 * @param {object} c
 * @param {import('../controller/auth/index.js').AuthController} c.authController
 * @param {import('../controller/security').SecurityController} c.securityController
 * @param {import('../controller/transaction/index.js').TransactionController} c.transactionController
 * @param {object} m
 * @param {import('../models/users/index.js').UsersModel} m.usersModel
 * @param {import('../models/security/index.js').SecurityModel} m.securityModel
 * @returns
 */
export function router(
  { authController, securityController, transactionController },
  { usersModel, securityModel }
) {
  const r = Router();

  r.get('/', (_, res) => res.status(200).json({ message: 'Hello, world!' }));

  r.use('/auth', authRouter(authController));

  r.use(authenticate(usersModel));
  r.use(
    '/transaction',
    transactionRouter(transactionController, securityModel)
  );
  r.use('/security', securityRouter(securityController));

  return r;
}
