import { genToken } from '../../lib/jwt/index.js';

export class AuthController {
  #users;
  /** @param {import('../../models/users/index.js').UsersModel} users */
  constructor(users) {
    this.#users = users;
  }

  /** @type {import('express').RequestHandler} */
  async Login(req, res) {
    const { email, password } = req.body || {};

    try {
      if (!email) throw new Error('MISSING_EMAIL');
      if (!password) throw new Error('MISSING_PASSWORD');
      const user = await this.#users?.Authenticate({ email, password });

      const access_token = genToken({ id: user.id, email: user.email });

      return res.status(200).json({
        status: 200,
        code: null,
        message: 'success login',
        data: {
          access_token,
        },
      });
    } catch (error) {
      if (error.message === 'MISSING_EMAIL') {
        return res.status(400).json({
          status: 400,
          code: 'BAD_FORM_REQUEST',
          message: 'email is required',
        });
      }
      if (error.message === 'MISSING_PASSWORD') {
        return res.status(400).json({
          status: 400,
          code: 'BAD_FORM_REQUEST',
          message: 'password is required',
        });
      }
      if (['USER_NOT_FOUND', 'USER_INVALID'].includes(error.message)) {
        return res.status(400).json({
          status: 400,
          code: 'BAD_REQUEST',
          message: 'user is invalid',
        });
      }

      return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unknown error occured',
      });
    }
  }

  /** @type {import('express').RequestHandler} */
  async GetMe(req, res) {
    try {
      const id = req.user?.id;
      if (!id) throw new Error('USER_NOT_FOUND');

      const data = await this.#users.GetById({ id });
      if (!data) throw new Error('ACCOUNT_NOT_FOUND');

      return res.status(200).json({
        status: 200,
        code: null,
        message: 'get self information success',
        data,
      });
    } catch (error) {
      if (['USER_NOT_FOUND', 'USER_INVALID'].includes(error.message)) {
        return res.status(400).json({
          status: 400,
          code: 'BAD_REQUEST',
          message: 'user is invalid',
        });
      }
      if (error.message === 'ACCOUNT_NOT_FOUND') {
        return res.status(404).json({
          status: 404,
          code: 'ACCOUNT_NOT_FOUND',
          message: 'account not found',
        });
      }

      return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unknown error occured',
      });
    }
  }
}
