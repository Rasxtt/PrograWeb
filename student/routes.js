// student/routes.js
import { Router } from 'express';
import * as controller from './controllers.js';

const router = Router();

router.get('/mi-cuenta', controller.home);
router.get('/mis-clubes', controller.home);
router.get('/mis-inscripciones', controller.home);
router.get('/tablon/:id', controller.home);
router.get('/tablon/:clubId/anuncio/:postId', controller.home);

export default router;
