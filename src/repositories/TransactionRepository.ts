import { db } from '../config/database';
import { Transaction, CreateTransactionDto } from '../models/Transaction';

export class TransactionRepository {
  private readonly tableName = 'transactions';

  async create(transactionData: CreateTransactionDto): Promise<Transaction> {
    const [id] = await db(this.tableName)
      .insert({
        ...transactionData,
        metadata: JSON.stringify(transactionData.metadata || {}),
        created_at: new Date(),
      });

    if (!id) {
      throw new Error('Failed to create transaction - no ID returned');
    }

    const transaction = await this.findById(id);
    if (!transaction) {
      throw new Error('Failed to create transaction');
    }
    return transaction;
  }

  async findById(id: number): Promise<Transaction | null> {
    const transaction = await db(this.tableName)
      .where({ id })
      .first();

    if (transaction && transaction.metadata) {
      transaction.metadata = JSON.parse(transaction.metadata);
    }

    return transaction || null;
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const transaction = await db(this.tableName)
      .where({ reference })
      .first();

    if (transaction && transaction.metadata) {
      transaction.metadata = JSON.parse(transaction.metadata);
    }

    return transaction || null;
  }

  async findByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    const transactions = await db(this.tableName)
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return transactions.map((transaction: any) => {
      if (transaction.metadata) {
        transaction.metadata = JSON.parse(transaction.metadata);
      }
      return transaction;
    });
  }

  async findByUserIdAndType(
    userId: number, 
    type: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<Transaction[]> {
    const transactions = await db(this.tableName)
      .where({ user_id: userId, type })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return transactions.map((transaction: any) => {
      if (transaction.metadata) {
        transaction.metadata = JSON.parse(transaction.metadata);
      }
      return transaction;
    });
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await db(this.tableName)
      .where({ id })
      .update({ status });
  }
} 