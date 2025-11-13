export class SecurityController {
  #security;

  /** @param {import('../../models/security/index.js').SecurityModel} security */
  constructor(security) {
    this.#security = security;
  }

  /** @type {import('express').RequestHandler} */
  async CsrfToken(_, res) {
    try {
      const { token } = await this.#security.GenerateCsrfToken();
      res.status(201).json({
        status: 201,
        code: null,
        message: 'generating csrf token success',
        data: {
          csrf_token: token,
        },
      });
    } catch {
      return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unknown error occured',
      });
    }
  }
}
