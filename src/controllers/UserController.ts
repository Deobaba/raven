import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    const user = await this.userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  };

  generateVirtualAccount = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    const user = await this.userService.generateVirtualAccount(userId);

    res.status(200).json({
      success: true,
      message: 'Virtual account generated successfully',
      data: user,
    });
  };
} 