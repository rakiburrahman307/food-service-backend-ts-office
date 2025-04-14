import Stripe from 'stripe';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import PaymentModel from './payment.model';
import OrderModel from '../orders/orders.model';
import mongoose, { Types } from 'mongoose';
import generateOrderNumber from '../../../util/genarateOrderNumber';
import { User } from '../user/user.model';
import { sendUserNotification } from '../../../helpers/sendUserNotification';
import { stripe } from '../../../config/stripe';
import ShopModel from '../businessDashboard/shop/shop.model';
import { sendNotifications } from '../../../helpers/sendNotification';

// Retrieve the Payment Intent
const retrievePaymentIntent = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

const storeOrderWithTransaction = async (
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  products: any[],
  totalDiscount: number,
  shopId: string
) => {
  let session = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  while (retryCount < MAX_RETRIES) {
    try {
      // Create a completely fresh session for each attempt
      if (session) {
        try {
          await session.endSession();
        } catch (e) {
          console.log('Error ending previous session:', e);
        }
      }

      session = await mongoose.startSession();

      // Start transaction with explicit settings
      session.startTransaction({
        readConcern: { level: 'local' }, // Changed from snapshot to local
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
      });

      // Calculate values outside the transaction
      const subTotal = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
      const totalAmount = paymentIntent.amount_received / 100;
      const orderNumber = generateOrderNumber();

      // Prepare documents
      const productMappings = products.map((product: any) => ({
        productId: product.productId,
        shopId: product.shopId,
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.price * product.quantity,
      }));

      // First fetch data to verify it exists
      const owner = await ShopModel.findById(shopId).session(session);
      const user = await User.findById(userId).session(session);

      if (!owner) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
      }
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
      }

      // Get owner user info in a separate query
      const ownerInfo = await owner.populate({ path: 'userId', select: '_id' });

      // Create payment and order sequentially within the transaction
      const paymentResult = await PaymentModel.create(
        [
          {
            userId,
            products: productMappings,
            subTotal,
            revenue: owner.revenue,
            totalDiscount,
            orderNumber,
            paymentIntentId: paymentIntent.id,
            paymentMethod: 'Stripe',
            paymentStatus: paymentIntent.status,
            totalAmount,
            currency: paymentIntent.currency,
            orderStatus: 'pending',
          },
        ],
        { session }
      );

      await OrderModel.create(
        [
          {
            userId,
            shopId,
            orderNumber,
            revenue: owner.revenue,
            products: productMappings,
            totalDiscount,
            subTotal,
            paymentMethod: 'Stripe',
            currency: paymentIntent.currency,
            totalAmount,
            paymentIntentId: paymentIntent.id,
          },
        ],
        { session }
      );

      // Update user orders flag
      await User.findByIdAndUpdate(
        userId,
        { $set: { orders: true } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      console.log('Transaction committed successfully');

      // Close session explicitly
      await session.endSession();
      session = null;

      // Handle notifications outside the transaction
      try {
        console.log('standing Notification');
        await Promise.all([
          sendUserNotification(userId, {
            amount: totalAmount,
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.capture_method,
            transactionId: paymentIntent.id,
            orderNumber,
            date: Date.now(),
          }),
          sendNotifications({
            receiver: ownerInfo.userId._id,
            text: `New order #${orderNumber} has been placed by user ${user.name}`,
            type: 'ORDER',
            date: Date.now(),
          }),

          console.log('complete Notification'),
        ]);
      } catch (notificationErr) {
        console.error('Notification error (non-fatal):', notificationErr);
      }

      return paymentResult[0];
    } catch (error: any) {
      retryCount++;

      // Check if this is a transient error that can be retried
      const isTransientError =
        error.errorLabels?.includes('TransientTransactionError') ||
        error.code === 251 ||
        error.message?.includes('Transaction numbers');

      console.error(`Transaction attempt ${retryCount} failed:`, error);

      // Attempt to abort the transaction if it's still active
      if (session) {
        try {
          if (session.inTransaction()) {
            await session.abortTransaction();
            console.log('Transaction aborted');
          }
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }

        try {
          await session.endSession();
          session = null;
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }

      // If we have retries left and it's a transient error, continue to retry
      if (retryCount < MAX_RETRIES && isTransientError) {
        console.log(
          `Retrying transaction, attempt ${retryCount + 1}/${MAX_RETRIES}`
        );
        await new Promise(resolve =>
          setTimeout(resolve, 100 * Math.pow(2, retryCount))
        ); // Exponential backoff
        continue;
      }

      // If we've exhausted retries or it's not a transient error, throw
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to process payment and order'
      );
    }
  }

  // This should never be reached due to the return or throw in the loop
  throw new ApiError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Maximum retries exceeded for payment processing'
  );
};
// get payment info from db
const paymentInfoFromDb = async (
  id: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(
    PaymentModel.find({ userId: id }),
    query
  );
  const payments = await queryBuilder
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  const pagination = await queryBuilder.getPaginationInfo();

  return { payments, pagination };
};

// get specific info from db with populated productId
const specificPaymentInfo = async (id: string) => {
  const payment = await PaymentModel.findById(id).populate({
    path: 'products.productId',
    model: 'Meal',
    select: 'collectionTime',
  });

  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Payment not found');
  }
  return payment;
};
const createPayment = async (amount: number, currency: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount * 100),
    currency: currency,
    payment_method_types: ['card'],
  });

  return paymentIntent;
};
export const PaymentService = {
  retrievePaymentIntent,
  storeOrderWithTransaction,
  paymentInfoFromDb,
  specificPaymentInfo,
  createPayment,
};
