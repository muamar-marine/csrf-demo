import { Router } from 'express';
import { checkCsrfToken } from '../../middlewares/auth/index.js';

/**
 * @param {import('../../controller/transaction/index.js').TransactionController} c
 * @param {import('../../models/security/index.js').SecurityModel} securityModel
 */
export function transactionRouter(c, securityModel) {
  const r = Router();

  r.get('/balance', c.Balance.bind(c));

  r.post('/transfer-unsafe', c.Transfer.bind(c));
  r.post('/transfer', checkCsrfToken(securityModel), c.Transfer.bind(c));

  return r;
}
