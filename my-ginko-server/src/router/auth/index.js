import { Router } from 'express';

/** @param {import('../../controller/auth/index.js').AuthController} c */
export function authRouter(c) {
  const r = Router();

  r.post('/login', c.Login.bind(c));

  return r;
}
