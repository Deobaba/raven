import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { transferSchema } from '../validators/transactionValidator';
import { BadRequestError } from '../utils/errors';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  initiateTransfer = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = transferSchema.validate(req.body);
    
    if (error) {
      throw new BadRequestError(error.details?.[0]?.message || 'Validation error');
    }

    const userId = req.user!.id;
    const transaction = await this.transactionService.initiateTransfer(userId, value);

    res.status(201).json({
      success: true,
      message: 'Transfer initiated successfully',
      data: transaction,
    });
  };

  getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { type, page = '1', limit = '50' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestError('Invalid pagination parameters');
    }

    const transactions = await this.transactionService.getTransactionHistory(
      userId,
      type as string,
      pageNum,
      limitNum
    );

    res.status(200).json({
      success: true,
      message: 'Transaction history retrieved successfully',
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: transactions.length,
      },
    });
  };

  getTransactionById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const transactionIdParam = req.params.id;
    
    if (!transactionIdParam) {
      throw new BadRequestError('Transaction ID is required');
    }

    const transactionId = parseInt(transactionIdParam, 10);

    if (!transactionId || transactionId < 1) {
      throw new BadRequestError('Invalid transaction ID');
    }

    const transaction = await this.transactionService.getTransactionById(transactionId, userId);

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  };
} 