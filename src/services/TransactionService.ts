import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { RavenService } from './RavenService';
import { Transaction, TransferDto, WebhookDepositDto } from '../models/Transaction';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/errors';
import { logger } from '../utils/logger';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private userRepository: UserRepository;
  private ravenService: RavenService;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.userRepository = new UserRepository();
    this.ravenService = new RavenService();
  }

  async initiateTransfer(userId: number, transferData: TransferDto): Promise<Transaction> {
    // Validate transfer amount
    const maxAmount = Number(process.env.TRANSFER_LIMIT) || 10000;
    if (transferData.amount > maxAmount) {
      throw new BadRequestError(`Transfer amount cannot exceed ₦${maxAmount / 100}`);
    }

    // Get user details
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate unique reference
    const reference = this.generateReference();

    try {
      // Initiate transfer via Raven API
      const transferResponse = await this.ravenService.initiateTransfer({
        account_number: transferData.recipient_account_number,
        bank_code: transferData.recipient_bank_code,
        amount: transferData.amount,
        narration: transferData.description || 'Money Transfer',
        reference,
      });

      // Save transaction to database
      const transaction = await this.transactionRepository.create({
        user_id: userId,
        type: 'transfer',
        amount: transferData.amount,
        reference,
        status: transferResponse.status === 'success' ? 'success' : 'pending',
        description: transferData.description,
        metadata: {
          recipient_account_number: transferData.recipient_account_number,
          recipient_bank_code: transferData.recipient_bank_code,
          raven_reference: transferResponse.reference,
          raven_status: transferResponse.status,
          raven_message: transferResponse.message,
        },
      });

      logger.info(`Transfer initiated: ${reference} for user ${userId}`);
      return transaction;

    } catch (error) {
      logger.error(`Failed to initiate transfer for user ${userId}:`, error);
      
      // Save failed transaction
      await this.transactionRepository.create({
        user_id: userId,
        type: 'transfer',
        amount: transferData.amount,
        reference,
        status: 'failed',
        description: transferData.description,
        metadata: {
          recipient_account_number: transferData.recipient_account_number,
          recipient_bank_code: transferData.recipient_bank_code,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw new InternalServerError('Failed to process transfer');
    }
  }

  async handleDeposit(depositData: WebhookDepositDto): Promise<Transaction | null> {
    try {
      // Find user by account number
      const user = await this.userRepository.findByAccountNumber(depositData.account_number);
      if (!user) {
        logger.warn(`Deposit webhook received for unknown account: ${depositData.account_number}`);
        return null;
      }

      // Check if transaction already exists
      const existingTransaction = await this.transactionRepository.findByReference(depositData.reference);
      if (existingTransaction) {
        logger.info(`Duplicate deposit webhook received: ${depositData.reference}`);
        return existingTransaction;
      }

      // Create deposit transaction
      const transaction = await this.transactionRepository.create({
        user_id: user.id,
        type: 'deposit',
        amount: depositData.amount,
        reference: depositData.reference,
        status: 'success',
        description: depositData.description || 'Deposit via bank transfer',
        metadata: {
          sender_name: depositData.sender_name,
          account_number: depositData.account_number,
        },
      });

      logger.info(`Deposit processed: ${depositData.reference} for user ${user.id}`);
      return transaction;

    } catch (error) {
      logger.error('Failed to handle deposit webhook:', error);
      throw new InternalServerError('Failed to process deposit');
    }
  }

  async getTransactionHistory(
    userId: number, 
    type?: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<Transaction[]> {
    const offset = (page - 1) * limit;

    if (type && ['deposit', 'transfer'].includes(type)) {
      return this.transactionRepository.findByUserIdAndType(userId, type, limit, offset);
    }

    return this.transactionRepository.findByUserId(userId, limit, offset);
  }

  async getTransactionById(transactionId: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(transactionId);
    
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.user_id !== userId) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN_${timestamp}_${random}`;
  }
} 