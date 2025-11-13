import { Pool } from 'pg';

import { kDatabase } from './constants/database.js';

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
      await this.client.query('BEGIN');

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kanji (
      //     id TEXT PRIMARY KEY,
      //     character TEXT NOT NULL,
      //     grade INTEGER,
      //     jlpt INTEGER,
      //     freq INTEGER,
      //     stroke_count INTEGER,
      //     radical INTEGER NOT NULL,
      //     onyomi TEXT[],
      //     kunyomi TEXT[],
      //     nanori TEXT[],
      //     meaning TEXT[]
      //   );
      // `);

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba (
      //     id INTEGER PRIMARY KEY
      //   );
      // `);

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba_kanji (
      //     id TEXT PRIMARY KEY,
      //     kotoba_id INTEGER REFERENCES kotoba(id) ON DELETE CASCADE,
      //     expression TEXT NOT NULL,
      //     information TEXT[],
      //     priority TEXT[]
      //   );
      // `);

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba_kanji_related (
      //     id SERIAL PRIMARY KEY,
      //     kotoba_kanji_id TEXT REFERENCES kotoba_kanji(id) ON DELETE CASCADE,
      //     c TEXT NOT NULL,
      //     kanji_id TEXT REFERENCES kanji(id) ON DELETE CASCADE
      //   );
      // `);

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba_reading (
      //     id TEXT PRIMARY KEY,
      //     kotoba_id INTEGER REFERENCES kotoba(id) ON DELETE CASCADE,
      //     expression TEXT NOT NULL,
      //     is_no_kanji BOOLEAN DEFAULT false,
      //     restricted TEXT[],
      //     information TEXT[],
      //     priority TEXT[]
      //   );
      // `);
      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba_definitions (
      //     id TEXT PRIMARY KEY,
      //     kotoba_id INTEGER REFERENCES kotoba(id) ON DELETE CASCADE,
      //     restricted_kanji TEXT[],
      //     restricted_reading TEXT[],
      //     part_of_speech TEXT[],
      //     cross_refs TEXT[],
      //     antonyms TEXT[],
      //     fields TEXT[],
      //     tags TEXT[]
      //   );
      // `);

      // await this.client.query(`
      //   CREATE TABLE IF NOT EXISTS kotoba_definition_glossary (
      //     id SERIAL PRIMARY KEY,
      //     kotoba_definitions_id TEXT REFERENCES kotoba_definitions(id) ON DELETE CASCADE,
      //     value TEXT NOT NULL,
      //     g_type TEXT
      //   );
      // `);

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
