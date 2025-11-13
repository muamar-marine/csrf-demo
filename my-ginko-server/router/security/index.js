import { Router } from 'express';
import SecurityController from '../../controller/security/index.js';

const r = Router();

r.get('/csrf', SecurityController.CsrfToken);

export { r as securityRouter };
