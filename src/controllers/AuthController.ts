import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { signupSchema, loginSchema } from '../validators/authValidator';
import { BadRequestError } from '../utils/errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const { error, value } = signupSchema.validate(req.body);
    
    if (error) {
      throw new BadRequestError(error.details?.[0]?.message || 'Validation error');
    }

    const result = await this.authService.signup(value);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
      throw new BadRequestError(error.details?.[0]?.message || 'Validation error');
    }

    const result = await this.authService.login(value);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  };
} 