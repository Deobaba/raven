import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { webhookDepositSchema } from '../validators/transactionValidator';
import { BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';

export class WebhookController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  handleDeposit = async (req: Request, res: Response): Promise<void> => {
    // Log the raw webhook payload for debugging
    logger.info('Webhook received:', {
      headers: req.headers,
      body: req.body,
      ip: req.ip,
    });

    // Validate webhook secret (basic security)
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      logger.warn('Invalid webhook secret received');
      throw new BadRequestError('Invalid webhook secret');
    }

    const { error, value } = webhookDepositSchema.validate(req.body);
    
    if (error) {
      logger.error('Webhook validation error:', error.details);
      throw new BadRequestError(error.details?.[0]?.message || 'Validation error');
    }

    const transaction = await this.transactionService.handleDeposit(value);

    if (transaction) {
      res.status(200).json({
        success: true,
        message: 'Deposit processed successfully',
        data: { reference: transaction.reference },
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Webhook received but no matching account found',
      });
    }
  };
} 