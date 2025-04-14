import axios from 'axios';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

export class PayFastService {
  static async checkTransactionStatus(merchantId: string) {
    try {
      // Make API call to PayFast to check payment status (example, not real endpoint)
      const response = await axios.post('https://www.payfast.co.za/eng/query', {
        merchant_id: merchantId,
        // other necessary parameters
      });

      if (response.data.status === 'completed') {
        return 'completed';
      } else {
        return 'pending';
      }
    } catch (error) {
      console.error('Error checking PayFast transaction status:', error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error checking transaction status'
      );
    }
  }
}
