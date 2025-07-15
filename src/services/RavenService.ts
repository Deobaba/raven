import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { InternalServerError } from '../utils/errors';

interface TransferRequest {
  account_number: string;
  bank_code: string;
  amount: number;
  narration: string;
  reference: string;
}

interface TransferResponse {
  reference: string;
  status: string;
  message: string;
}

export class RavenService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.RAVEN_BASE_URL,
      headers: {
        'Authorization': `Bearer ${process.env.RAVEN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`Making request to Raven: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`Raven response: ${response.status} - ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Response error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async initiateTransfer(transferData: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await this.client.post('/transfers', transferData);

      return {
        reference: response.data.reference,
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      logger.error('Failed to initiate transfer:', error);
      throw new InternalServerError('Failed to initiate transfer');
    }
  }

  async verifyTransfer(reference: string): Promise<TransferResponse> {
    try {
      const response = await this.client.get(`/transfers/${reference}`);

      return {
        reference: response.data.reference,
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      logger.error('Failed to verify transfer:', error);
      throw new InternalServerError('Failed to verify transfer');
    }
  }
} 