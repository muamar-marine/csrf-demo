import { Router } from 'express';

import AuthController from '../../controller/auth/index.js';

const r = Router();

r.post('/login', AuthController.Login);

export { r as authRouter };
