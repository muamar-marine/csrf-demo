import 'dotenv/config';

export const kDatabase = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

export const kSecret = {
  jwt: process.env.SECRET_KEY,
};
