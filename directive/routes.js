// directive/routes.js
import { Router } from 'express';
import * as controller from './controllers.js';

const router = Router();

router.get('/mis-clubes-directiva', controller.home);
router.get('/club-admin/*path', controller.home);

export default router;
