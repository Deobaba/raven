import { db } from '../config/database';
import { User, CreateUserDto } from '../models/User';

export class UserRepository {
  private readonly tableName = 'users';

  async create(userData: Omit<CreateUserDto, 'password'> & { password_hash: string }): Promise<User> {
    const [id] = await db(this.tableName)
      .insert({
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
      });

    if (!id) {
      throw new Error('Failed to create user - no ID returned');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await db(this.tableName)
      .where({ id })
      .first();

    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db(this.tableName)
      .where({ email })
      .first();

    return user || null;
  }

  async updateVirtualAccount(userId: number, accountNumber: string, bankName: string): Promise<void> {
    await db(this.tableName)
      .where({ id: userId })
      .update({
        virtual_account_number: accountNumber,
        virtual_account_bank: bankName,
        updated_at: new Date(),
      });
  }

  async findByAccountNumber(accountNumber: string): Promise<User | null> {
    const user = await db(this.tableName)
      .where({ virtual_account_number: accountNumber })
      .first();

    return user || null;
  }
} 