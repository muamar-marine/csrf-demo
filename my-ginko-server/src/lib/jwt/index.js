import jwt from 'jsonwebtoken';

import { kSecret } from '../../constants/env.js';

const SECRET_KEY = kSecret.jwt;

const genToken = (payload) => jwt.sign(payload, SECRET_KEY);

const chkToken = (token) => jwt.verify(token, SECRET_KEY);

export { genToken, chkToken };
