import { Router } from 'express';
import { authenticate } from '../../middlewares/auth/index.js';

/** @param {import('../../controller/auth/index.js').AuthController} c */
export function authRouter(c, uM) {
  const r = Router();

  r.post('/login', c.Login.bind(c));
  r.get('/get-me', authenticate(uM), c.GetMe.bind(c));

  return r;
}
