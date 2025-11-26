import { Router } from 'express';
import { login, verificarToken } from '../controllers/auth.controller';

const router = Router();


router.post('/login', login);

router.get('/verify', verificarToken);

export default router;
