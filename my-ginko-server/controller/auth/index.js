class AuthController {
  /** @type {import('express').RequestHandler} */
  static Login(req, res) {
    const { email, password } = req.body || {};

    if (!email)
      return res.status(400).json({
        status: 400,
        code: 'BAD_FORM_REQUEST',
        message: 'email is required',
      });
    if (!password)
      return res.status(400).json({
        status: 400,
        code: 'BAD_FORM_REQUEST',
        message: 'pasword is required',
      });

    // GET FROM DB

    // CREATE JWT

    return res.status(200).json({
      status: 200,
      code: null,
      message: 'success login',
      data: {
        access_token: '',
      },
    });
  }
}

export default AuthController;
