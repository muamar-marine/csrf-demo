class TransactionController {
  /** @type {import('express').RequestHandler} */
  static Balance(req, res, next) {
    return res.status(200).json({
      message: 'Hello from balance',
    });
  }

  /** @type {import('express').RequestHandler} */
  static Transfer(req, res, next) {
    const isUnsafe = req.query?.unsafe === 'true';

    if (!isUnsafe) {
      // Checking csrf_token in DB whether exists or not
      // IF yes -> return 200 and remove csrf_token from db
      // IF no -> return 400
    }

    return res.status(200).json({
      message: 'Hello from transfer' + (isUnsafe ? ' unsafe' : ''),
    });
  }
}

export default TransactionController;
