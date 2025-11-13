import crypto from 'crypto';

export class SecurityModel {
  #db;

  /** @param {import('../../db/index.js').Db} db */
  constructor(db) {
    this.#db = db;
  }

  async GenerateCsrfToken() {
    try {
      const token = crypto.randomBytes(32).toString('hex');

      const now = new Date();
      const voidAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

      const q = `INSERT INTO tokens(token, type, void_at) VALUES ($1, $2, $3) RETURNING token`;
      const result = await this.#db.client.query(q, [token, 'csrf', voidAt]);

      return result.rows?.[0];
    } catch (error) {
      throw error;
    }
  }

  async CheckCsrfToken(payload) {
    try {
      const q = `SELECT * FROM tokens WHERE token = $1`;
      const result = await this.#db.client.query(q, [payload.token]);

      const token = result.rows?.[0];
      if (!token) throw new Error('CSRF_TOKEN_INVALID');

      const voidAt = new Date(token.void_at + 'Z');
      const now = new Date();

      const q2 = `DELETE FROM tokens WHERE id = $1`;
      await this.#db.client.query(q2, [token.id]);
      if (now > voidAt) throw new Error('CSRF_TOKEN_INVALID');
    } catch (error) {
      throw error;
    }
  }
}
