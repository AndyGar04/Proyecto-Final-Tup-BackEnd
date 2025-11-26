import { Router } from 'express';
import { login, register, verificarToken, getAllUsuarios } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();


router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);

router.get('/verify', verificarToken);
router.get('/usuarios', getAllUsuarios);

export default router;
