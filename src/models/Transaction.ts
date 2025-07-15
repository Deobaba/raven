export type TransactionType = 'deposit' | 'transfer';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  id: number;
  user_id: number;
  type: TransactionType;
  amount: number;
  reference: string;
  status: TransactionStatus;
  description?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface CreateTransactionDto {
  user_id: number;
  type: TransactionType;
  amount: number;
  reference: string;
  status: TransactionStatus;
  description?: string;
  metadata?: Record<string, any>;
}

export interface TransferDto {
  recipient_account_number: string;
  recipient_bank_code: string;
  amount: number;
  description?: string;
}

export interface WebhookDepositDto {
  reference: string;
  amount: number;
  account_number: string;
  sender_name?: string;
  description?: string;
} 