// website/routes.js
import { Router } from 'express';
import * as controller from './controllers.js';

const router = Router();

router.get('/', controller.home);
router.get('/directorio', controller.home);
router.get('/cartelera', controller.home);
router.get('/club/:id', controller.home);
router.get('/actividad/:id', controller.home);
router.get('/login', controller.home);
router.get('/registro', controller.home);
router.get('/recuperar-password', controller.home);
router.get('/registrar-club', controller.home);
router.get('/403', controller.home);
router.get('/404', controller.home);

export default router;