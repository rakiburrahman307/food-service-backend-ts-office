import { StatusCodes } from 'http-status-codes';
import ApiError from '../errors/ApiError';
import PaymentModel from '../app/modules/payment/payment.model';
import ShopModel from '../app/modules/businessDashboard/shop/shop.model';
import OrderModel from '../app/modules/orders/orders.model';
import { stripe } from '../config/stripe';

// Function to transfer funds to the vendor
const transferToVendor = async (shopId: string, paymentIntentId: string) => {
  try {
    const paymentInfo = await PaymentModel.findOne({
      paymentIntentId: paymentIntentId,
    });
    if (!paymentInfo) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
    }

    const vendorInfo: any = await ShopModel.findById(shopId)
      .populate({
        path: 'userId',
        select: 'stripeAccountId',
      })
      .exec();

    if (
      !vendorInfo ||
      !vendorInfo.userId ||
      !vendorInfo.userId.stripeAccountId
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Vendor Stripe account not found'
      );
    }

    const stripeAccountId = vendorInfo.userId.stripeAccountId;
    const adminParcentage = await ShopModel.findById(shopId);
    if (!adminParcentage) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Admin fee percentage not found'
      );
    }

    const adminFeeAmount = Math.floor(
      (paymentInfo.totalAmount * adminParcentage.revenue) / 100
    );
    const remainingAmount = paymentInfo.totalAmount - adminFeeAmount;

    // Check Stripe platform balance to ensure sufficient funds
    const balance = await stripe.balance.retrieve();
    if (balance.available[0].amount < remainingAmount * 100) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Insufficient funds in platform account for transfer'
      );
    }
    // Verify the vendor's Stripe account before transferring
    const account = await stripe.accounts.retrieve(stripeAccountId);
    if (account.requirements && account.requirements.disabled_reason) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Vendor's Stripe account is not enabled: ${account.requirements.disabled_reason}`
      );
    }

    // Create a transfer to the vendor's Stripe account
    const transfer = await stripe.transfers.create({
      amount: Math.floor(remainingAmount * 100), // Convert to cents
      currency: 'usd',
      destination: stripeAccountId,
    });

    // Payout to vendor's external bank account or card
    const externalAccount = await stripe.accounts.listExternalAccounts(
      stripeAccountId,
      { object: 'bank_account' }
    );
    if (!externalAccount.data.length) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'No external bank accounts found for the vendor'
      );
    }
    const payout = await stripe.payouts.create(
      {
        amount: Math.floor(remainingAmount * 100), // Convert to cents
        currency: 'usd',
        destination: externalAccount.data[0].id,
        method: 'standard', // Can change to 'instant' for instant payouts
      },
      { stripeAccount: stripeAccountId }
    );

    // Optionally, update payment status in the database
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId },
      { orderStatus: 'completed' },
      { new: true }
    );

    // Optionally, update the order status to 'completed'
    await OrderModel.findOneAndUpdate(
      { paymentIntentId },
      {
        orderStatus: 'completed',
      }
    );

    // Return the transfer and payout details for logging or response
    return { transfer, payout };
  } catch (error) {
    console.error('Transfer failed:', error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Transfer failed');
  }
};
export default transferToVendor;
