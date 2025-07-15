import { Router } from 'express';
import { WebhookController } from '../controllers/WebhookController';

const router = Router();
const webhookController = new WebhookController();

router.post('/deposit', webhookController.handleDeposit);

export { router as webhookRoutes }; 