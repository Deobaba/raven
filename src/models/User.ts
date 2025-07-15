export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number: string;
  virtual_account_number?: string;
  virtual_account_bank?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  virtual_account_number?: string;
  virtual_account_bank?: string;
  created_at: Date;
} 