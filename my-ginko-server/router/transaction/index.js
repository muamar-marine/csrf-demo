import { Router } from 'express';
import TransactionController from '../../controller/transaction/index.js';

const r = Router();

r.get('/balance', TransactionController.Balance);

r.post('/transfer', TransactionController.Transfer);

export { r as transactionRouter };
