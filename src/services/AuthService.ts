import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDto, LoginDto, UserResponse } from '../models/User';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { generateVirtualAccountNumber, generateVirtualBankName } from '../utils/accountGenerator';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(userData: CreateUserDto): Promise<{ user: UserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(userData.password, saltRounds);

    // Create user with virtual account details
    const user = await this.userRepository.create({
      full_name: userData.full_name,
      email: userData.email,
      phone_number: userData.phone_number,
      password_hash,
    });

    // Generate virtual account number automatically
    const virtualAccountNumber = generateVirtualAccountNumber(user.id);
    const virtualBankName = generateVirtualBankName();

    // Update user record with virtual account details
    await this.userRepository.updateVirtualAccount(
      user.id,
      virtualAccountNumber,
      virtualBankName
    );

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    // Return user response (without password) with virtual account details
    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      virtual_account_number: virtualAccountNumber,
      virtual_account_bank: virtualBankName,
      created_at: user.created_at,
    };

    return { user: userResponse, token };
  }

  async login(loginData: LoginDto): Promise<{ user: UserResponse; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    // Return user response (without password)
    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      virtual_account_number: user.virtual_account_number,
      virtual_account_bank: user.virtual_account_bank,
      created_at: user.created_at,
    };

    return { user: userResponse, token };
  }

  private generateToken(userId: number, email: string): string {
    const payload = { userId, email };
    const secret = process.env.JWT_SECRET!;
    const options: SignOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' as any };

    return jwt.sign(payload, secret, options);
  }
} 