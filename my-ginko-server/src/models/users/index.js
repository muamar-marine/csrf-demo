import format from 'pg-format';
import { Db } from '../../db/index.js';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export class UsersModel {
  /*** @type {Db | undefined} */
  #db;
  /** @param {Db} db */
  constructor(db) {
    this.#db = db;
  }

  /**
   * @param {object} payload
   * @param {string} payload.email
   * @param {string} payload.password
   * @returns
   */
  async Authenticate(payload) {
    try {
      const q = `SELECT * FROM users WHERE email = $1`;
      const result = await this.#db.client.query(q, [payload.email]);

      const user = result.rows?.[0];
      if (!user) throw new Error('USER_NOT_FOUND');

      const isPasswordValid = compareSync(payload.password, user.password);
      if (!isPasswordValid) throw new Error('USER_INVALID');

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async GetByEmail(payload) {
    try {
      const q = `SELECT id, email, name, created_at FROM users WHERE email = $1`;
      const result = await this.#db.client.query(q, [payload.email]);

      const user = result.rows?.[0];
      if (!user) throw new Error('USER_NOT_FOUND');

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @typedef {object} User
   * @property {number} id
   * @property {string} email
   * @property {string} password
   * @property {string} name
   *
   * @param {User[]} payload
   */
  async SeedUser(payload) {
    const input = payload.map(({ email, name, password, id }) => {
      const p = hashSync(password, genSaltSync(10));
      return [id, email, name, p];
    });

    const q = format(
      `INSERT INTO users(id, email, name, password) VALUES %L ON CONFLICT (id) DO NOTHING`,
      input
    );

    await this.#db.client.query(q);
  }

  /**
   * @typedef {object} Account
   * @property {number} id
   * @property {number} user_id
   * @property {string} account_number
   * @property {string} balance
   *
   * @param {Account[]} payload
   */
  async SeedAccount(payload) {
    const input = payload.map(({ id, account_number, balance, user_id }) => {
      return [id, account_number, balance, user_id];
    });

    const q = format(
      `INSERT INTO accounts(id, account_number, balance, user_id) VALUES %L ON CONFLICT (id) DO NOTHING`,
      input
    );

    await this.#db.client.query(q);
  }
}
