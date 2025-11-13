import { Router } from 'express';

/**
 * @param {import('../../controller/security/index.js').SecurityController} c
 */
export function securityRouter(c) {
  const r = Router();

  r.get('/csrf', c.CsrfToken.bind(c));

  return r;
}
