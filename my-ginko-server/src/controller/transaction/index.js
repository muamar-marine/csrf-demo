export class TransactionController {
  #transactions;
  /** @param {import('../../models/transactions/index.js').TransactionsModel} transactions */
  constructor(transactions) {
    this.#transactions = transactions;
  }
  /** @type {import('express').RequestHandler} */
  async Balance(req, res) {
    try {
      const id = req.user?.id;
      if (!id) throw new Error('USER_NOT_FOUND');

      const data = await this.#transactions.CheckBalance({ id });
      if (!data) throw new Error('ACCOUNT_NOT_FOUND');

      return res.status(200).json({
        status: 200,
        code: null,
        message: 'get balance success',
        data,
      });
    } catch (error) {
      if (['USER_NOT_FOUND', 'USER_INVALID'].includes(error.message)) {
        return res.status(400).json({
          status: 400,
          code: 'BAD_REQUEST',
          message: 'user is invalid',
        });
      }

      if (error.message === 'ACCOUNT_NOT_FOUND') {
        return res.status(404).json({
          status: 404,
          code: 'ACCOUNT_NOT_FOUND',
          message: 'account not found',
        });
      }

      return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unknown error occured',
      });
    }
  }

  /** @type {import('express').RequestHandler} */
  async Transfer(req, res) {
    try {
      const id = req.user?.id;
      const { account_number, amount } = req.body || {};
      if (!amount || amount <= 10000 || isNaN(Number(amount)))
        throw new Error('INSUFFICIENT_AMOUNT');

      if (!account_number) throw new Error('MISSING_ACCOUNT_NUMBER');

      await this.#transactions.Transfer({
        amount,
        my_id: id,
        target_account_number: account_number,
      });

      return res.status(200).json({
        status: 200,
        code: null,
        message: 'transfer success',
        data: null,
      });
    } catch (error) {
      if (error.message === 'MISSING_ACCOUNT_NUMBER') {
        return res.status(400).json({
          status: 400,
          code: 'BAD_FORM_REQUEST',
          message: 'account_number is required',
        });
      }

      if (error.message === 'INSUFFICIENT_AMOUNT') {
        return res.status(400).json({
          status: 400,
          code: 'BAD_FORM_REQUEST',
          message: 'amount should be more than rp.10,000',
        });
      }

      if (error.message === 'ACCOUNT_NOT_FOUND') {
        return res.status(404).json({
          status: 404,
          code: 'ACCOUNT_NOT_FOUND',
          message: 'account not found',
        });
      }
      if (error.message === 'INSUFFICIENT_BALANCE') {
        return res.status(400).json({
          status: 400,
          code: 'INSUFFICIENT_BALANCE',
          message: 'your balance is not sufficient',
        });
      }
      return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unknown error occured',
      });
    }
  }
}
