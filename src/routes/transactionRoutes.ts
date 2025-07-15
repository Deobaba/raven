import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const transactionController = new TransactionController();

// All transaction routes require authentication
router.use(authMiddleware);

router.post('/transfer', transactionController.initiateTransfer);
router.get('/', transactionController.getTransactionHistory);
router.get('/:id', transactionController.getTransactionById);

export { router as transactionRoutes }; 