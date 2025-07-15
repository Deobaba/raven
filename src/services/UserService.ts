import { UserRepository } from '../repositories/UserRepository';
import { UserResponse } from '../models/User';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { generateVirtualAccountNumber, generateVirtualBankName } from '../utils/accountGenerator';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserProfile(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      virtual_account_number: user.virtual_account_number,
      virtual_account_bank: user.virtual_account_bank,
      created_at: user.created_at,
    };
  }

  async generateVirtualAccount(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user already has a virtual account
    if (user.virtual_account_number) {
      return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        virtual_account_number: user.virtual_account_number,
        virtual_account_bank: user.virtual_account_bank,
        created_at: user.created_at,
      };
    }

    // Generate virtual account number in-app
    const virtualAccountNumber = generateVirtualAccountNumber(user.id);
    const virtualBankName = generateVirtualBankName();

    // Update user record with virtual account details
    await this.userRepository.updateVirtualAccount(
      user.id,
      virtualAccountNumber,
      virtualBankName
    );

    logger.info(`Virtual account generated for user ${userId}: ${virtualAccountNumber}`);

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      virtual_account_number: virtualAccountNumber,
      virtual_account_bank: virtualBankName,
      created_at: user.created_at,
    };
  }
} 