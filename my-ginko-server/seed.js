import 'dotenv/config';

import fs from 'fs';
import { Db } from './src/db/index.js';
import { UsersModel } from './src/models/users/index.js';

const db = new Db();

const users = new UsersModel(db);

await db.init();

await db.createTable();

function parseJson(path) {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

const userData = parseJson('./src/seeds/users.json');
const accountData = parseJson('./src/seeds/accounts.json');

try {
  await users.SeedUser(userData);
  console.log(
    `✅ User Data has been inserted. Total records: ${userData.length} users`
  );
  await users.SeedAccount(accountData);
  console.log(
    `✅ Account Data has been inserted. Total records: ${accountData.length} accounts`
  );
} catch (error) {
  console.error(error);
} finally {
  await db.close();
}
