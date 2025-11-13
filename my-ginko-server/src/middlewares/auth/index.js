import { chkToken } from '../../lib/jwt/index.js';

/**
 * @param {import('../../models/users/index.js').UsersModel} users
 * @returns {import('express').RequestHandler}
 */
export function authenticate(users) {
  return async (req, res, next) => {
    try {
      const authorization = req.headers.authorization?.replace('Bearer ', '');
      const token = chkToken(authorization);

      if (!token) throw new Error('INVALID_TOKEN');

      const user = await users.GetByEmail({ email: token.email });
      if (!user) throw new Error('INVALID_TOKEN');

      req.user = user;
      next();
    } catch (error) {
      if (
        [
          'jwt must be provided',
          'USER_NOT_FOUND',
          'USER_INVALID',
          'INVALID_TOKEN',
        ].includes(error.message)
      ) {
        return res.status(400).json({
          status: 400,
          code: 'BAD_REQUEST',
          message: 'invalid token',
        });
      }
      next(error);
    }
  };
}

/**
 * @param {import('../../models/security/index.js').SecurityModel} security
 * @returns {import('express').RequestHandler}
 */
export function checkCsrfToken(security) {
  return async (req, res, next) => {
    try {
      const csrfToken = req.headers?.['x-csrf-token'];

      if (!csrfToken) throw new Error('CSRF_TOKEN_INVALID');

      await security.CheckCsrfToken({ token: csrfToken });
      next();
    } catch (error) {
      if (error.message === 'CSRF_TOKEN_INVALID') {
        return res.status(401).json({
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'invalid csrf token',
        });
      }
      next(error);
    }
  };
}
