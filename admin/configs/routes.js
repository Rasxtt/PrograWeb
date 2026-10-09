// admin/configs/routes.js
import { Router } from 'express';
import * as admins from '../controllers/admin_controllers.js';

const router = Router();

router.get('/admin', admins.home);
router.get('/admin/*path', admins.home);

export default router;