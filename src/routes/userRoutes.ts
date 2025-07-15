import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.post('/virtual-account', userController.generateVirtualAccount);

export { router as userRoutes }; 