import { Db } from '../../db/index.js';

export class TransactionsModel {
  /*** @type {Db | undefined} */
  #db;
  /** @param {Db} db */
  constructor(db) {
    this.#db = db;
  }

  async CheckBalance(payload) {
    try {
      const q = `SELECT * FROM accounts WHERE user_id = $1`;
      const result = await this.#db.client.query(q, [payload.id]);

      const account = result.rows?.[0];
      if (!account) throw new Error('ACCOUNT_NOT_FOUND');

      return {
        account_number: account.account_number,
        balance: account.balance,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {object} payload
   * @param {string} payload.target_account_number
   * @param {string} payload.my_id
   * @param {number} payload.amount
   */
  async Transfer(payload) {
    try {
      await this.#db.client.query('BEGIN');
      const q = `SELECT * FROM accounts WHERE account_number = $1 FOR UPDATE`;
      const resultTarget = await this.#db.client.query(q, [
        payload.target_account_number,
      ]);
      const q2 = `SELECT * FROM accounts WHERE user_id = $1 FOR UPDATE`;
      const resultMy = await this.#db.client.query(q2, [payload.my_id]);

      if (!resultTarget.rows?.[0]) throw new Error('ACCOUNT_NOT_FOUND');
      if (resultMy.rows?.[0]?.balance < payload.amount)
        throw new Error('INSUFFICIENT_BALANCE');

      const q3 = `
        UPDATE accounts SET balance = balance - $1 WHERE account_number = $2;
      `;
      await this.#db.client.query(q3, [
        payload.amount,
        resultMy.rows?.[0].account_number,
      ]);

      const q4 = `
        UPDATE accounts SET balance = balance + $1 WHERE account_number = $2;
      `;
      await this.#db.client.query(q4, [
        payload.amount,
        payload.target_account_number,
      ]);

      await this.#db.client.query('COMMIT');
    } catch (error) {
      await this.#db.client.query('ROLLBACK');
      throw error;
    }
  }
}
