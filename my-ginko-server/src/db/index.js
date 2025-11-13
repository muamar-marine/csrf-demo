import { Pool, types } from 'pg';

import { kDatabase } from '../constants/env.js';

const pool = new Pool(kDatabase);

export class Db {
  /**
   * @type {import('pg').PoolClient}
   */
  client;

  async init() {
    this.client = await pool.connect();
  }

  async createTable() {
    try {
      types.setTypeParser(1114, (str) => str);
      types.setTypeParser(1184, (str) => str);
      await this.client.query('BEGIN');

      await this.client.query(`
        SET TIME ZONE 'UTC';

        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );  

        CREATE TABLE IF NOT EXISTS accounts(
          id SERIAL PRIMARY KEY,
          user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
          account_number VARCHAR(16) NOT NULL,
          balance INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tokens(
          id SERIAL PRIMARY KEY,
          token VARCHAR(100) NOT NULL,
          type VARCHAR(25) NOT NULL,
          void_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await this.client.query('COMMIT');
      console.log('✅ All tables created');
    } catch (error) {
      this.client.query('ROLLBACK');
      console.error('❌ Error:', error);
      await this.close();
    }
  }

  async close() {
    this.client?.release();
    await pool.end();
  }
}
