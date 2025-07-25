import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export { router as authRoutes }; 