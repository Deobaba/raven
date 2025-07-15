/**
 * Utility functions for generating virtual account numbers
 */

/**
 * Generate a virtual account number
 * Format: 10-digit number starting with 99 (to avoid conflicts with real bank accounts)
 * @param userId - User ID to ensure uniqueness
 * @returns Virtual account number
 */
export function generateVirtualAccountNumber(userId: number): string {
  // Use timestamp and user ID for uniqueness
  const timestamp = Date.now().toString();
  const userIdStr = userId.toString().padStart(4, '0');
  
  // Take last 6 digits of timestamp and combine with user ID
  const timestampPart = timestamp.slice(-6);
  const accountNumber = `99${timestampPart}${userIdStr}`.slice(0, 10);
  
  return accountNumber;
}

/**
 * Generate a virtual bank name for the account
 * @returns Virtual bank name
 */
export function generateVirtualBankName(): string {
  return 'Raven Virtual Bank';
}

/**
 * Validate virtual account number format
 * @param accountNumber - Account number to validate
 * @returns True if valid format
 */
export function isValidVirtualAccountNumber(accountNumber: string): boolean {
  // Should be 10 digits starting with 99
  return /^99\d{8}$/.test(accountNumber);
} 