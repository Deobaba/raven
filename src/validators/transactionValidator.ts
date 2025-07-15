import Joi from 'joi';

export const transferSchema = Joi.object({
  recipient_account_number: Joi.string().length(10).pattern(/^\d+$/).required(),
  recipient_bank_code: Joi.string().length(3).pattern(/^\d+$/).required(),
  amount: Joi.number().positive().max(10000).required(), // Max ₦100 for testing
  description: Joi.string().max(255).optional(),
});

export const webhookDepositSchema = Joi.object({
  reference: Joi.string().required(),
  amount: Joi.number().positive().required(),
  account_number: Joi.string().required(),
  sender_name: Joi.string().optional(),
  description: Joi.string().optional(),
}); 