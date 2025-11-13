class SecurityController {
  /** @type {import('express').RequestHandler} */
  static CsrfToken(req, res, next) {
    // Generate token
    // Safe to DB

    res.status(201).json({
      status: 201,
      code: null,
      message: 'generating csrf token success',
      data: {
        csrf_token: '',
      },
    });
  }
}

export default SecurityController;
