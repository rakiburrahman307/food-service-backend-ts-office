import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import OrderModel from './orders.model';
import { OrderStatus } from './orders.interface';
import transferToVendor from '../../../helpers/transferToVendor';
import mongoose from 'mongoose';
import { stripe } from '../../../config/stripe';
import PaymentModel from '../payment/payment.model';
import { sendNotifications } from '../../../helpers/sendNotification';

const getOrderCompleteItemfromDb = async (
  id: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(
    OrderModel.find({
      userId: id,
      orderStatus: { $in: ['delivered', 'canceled'] },
    }),
    query
  );

  const complete = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.populate({
      path: 'products.shopId',
      select: 'shopName shopAddress',
    })
    .populate({
      path: 'products.productId',
      select: 'image',
    })
    .sort({ updatedAt: -1 });
  const meta = await queryBuilder.getPaginationInfo();
  return {
    complete,
    meta,
  };
};

const getOrderUpcomingfromDb = async (
  id: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(
    OrderModel.find({
      userId: id,
      orderStatus: { $in: ['preparing', 'pending', 'ready for pickup'] },
    }),
    query
  );

  const upcoming = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.populate({
      path: 'products.shopId',
      select: 'shopName shopAddress',
    })
    .populate({
      path: 'products.productId',
      select: 'image',
    })
    .sort({ updatedAt: -1 });
  const meta = await queryBuilder.getPaginationInfo();
  return { upcoming, meta };
};
const getOrderfromDb = async (
  shopId: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(OrderModel.find({ shopId }), query);

  const order = await queryBuilder
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['userId', 'shopId', 'products.productId'], {
      userId: 'name',
      shopId: 'shopAddress revenue',
      'products.productId': 'offerStatus',
    })
    .modelQuery.exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { order, pagination };
};
const updateOrderStatus = async (id: string, payload: OrderStatus) => {
  const order: any = await OrderModel.findById(id);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  const currentStatus = order.orderStatus;

  if (currentStatus === 'canceled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Order is canceled. No more status changes are allowed'
    );
  }

  if (currentStatus === 'delivered') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot update status. Order is already delivered'
    );
  }

  if (currentStatus === 'pending' && payload !== 'preparing') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Order can only be moved from pending to preparing'
    );
  }

  if (currentStatus === 'preparing' && payload !== 'ready for pickup') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Order can only be moved from preparing to ready for pickup'
    );
  }

  if (currentStatus === 'ready for pickup' && payload !== 'delivered') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Order can only be moved from ready for pickup to delivered'
    );
  }
  if (payload === 'preparing') {
    await transferToVendor(order?.shopId, order?.paymentIntentId);
    sendNotifications({
      receiver: order?.userId,
      text: `Your order ${order?.orderNumber} has been preparing`,
      type: 'ORDER',
      amount: order?.totalAmount,
    });
  }
  if (payload === 'ready for pickup') {
    await transferToVendor(order?.shopId, order?.paymentIntentId);
    sendNotifications({
      receiver: order?.userId,
      text: `Your order ${order?.orderNumber} has been ready for pickup`,
      type: 'ORDER',
      amount: order?.totalAmount,
    });
  }
  if (payload === 'delivered') {
    await transferToVendor(order?.shopId, order?.paymentIntentId);
    sendNotifications({
      receiver: order?.userId,
      text: `Your order ${order?.orderNumber} has been delivered`,
      type: 'DELIVERY',
      amount: order?.totalAmount,
    });
  }

  order.orderStatus = payload;
  await order.save();

  return order;
};
const getSingleDataFromDb = async (id: string) => {
  const order = await OrderModel.findById(id)
    .populate({
      path: 'shopId',
      select: 'revenue',
    })
    .populate({
      path: 'products.productId',
      select: 'collectionTime image',
    });
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return order;
};
const orderTotalAnalysisFromDb = async (shopId: string) => {
  const OrdersCount = await OrderModel.countDocuments({
    shopId,
  });
  const completedOrdersCount = await OrderModel.countDocuments({
    shopId,
    orderStatus: 'delivered',
  });

  const pendingOrdersCount = await OrderModel.countDocuments({
    shopId,
    orderStatus: 'pending',
  });

  const progressOrdersCount = await OrderModel.countDocuments({
    shopId,
    orderStatus: { $in: ['preparing', 'ready for pickup'] },
  });

  return {
    OrdersCount,
    completedOrdersCount,
    pendingOrdersCount,
    progressOrdersCount,
  };
};
// get cansel order model
const getCancelOrder = async (userId: string) => {
  const result = await OrderModel.find({
    userId,
    orderStatus: { $in: ['canceled'] },
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No cancelled orders found');
  }
  return result;
};

const cancelOrder = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the order and check eligibility in one step
    const order: any = await OrderModel.findById(id)
      .populate({
        path: 'shopId',
        select: 'revenue userId',
      })
      .session(session);

    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
    }

    // Check if order can be canceled (must be in pending status)
    if (order.orderStatus !== 'pending') {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Only pending orders can be canceled'
      );
    }

    // Check payment information
    if (!order.paymentIntentId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'PaymentIntent ID not found');
    }

    // Update order status
    order.orderStatus = 'canceled';

    // Calculate refund amount
    const adminFeeAmount = Math.floor(
      (order.totalAmount * order?.shopId?.revenue) / 100
    );
    const remainingAmount = order.totalAmount - adminFeeAmount;

    // If refundAmount is 0 or less, no refund can be processed
    if (remainingAmount <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No refundable amount left');
    }

    // Process the refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: remainingAmount,
    });

    // Update payment status
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: order.paymentIntentId },
      { paymentStatus: 'refunded' },
      { session }
    );

    // Save the order with updated status
    await order.save({ session });

    // Prepare notification data
    const customerNotification = {
      receiver: order.userId,
      text: `Your refund of ${remainingAmount} USD has been processed.`,
      type: 'REFUND',
      amount: remainingAmount,
    };

    const shopNotification = {
      receiver: order?.shopId?.userId,
      text: `Your order ${order?.orderNumber} has been cancelled.`,
      type: 'CANCELLED',
      amount: order?.totalAmount,
    };

    // Send notifications after transaction commits
    await session.commitTransaction();

    // Send notifications after successful transaction
    await Promise.all([
      sendNotifications(customerNotification),
      sendNotifications(shopNotification),
    ]);

    return refund;
  } catch (error: any) {
    // Rollback the transaction if anything fails
    await session.abortTransaction();
    console.error('Transaction error:', error.message);
    throw error;
  } finally {
    session.endSession();
  }
};
const confirmOrderStatusUser = async (orderId: string) => {
  try {
    // First check if the order exists and has the correct status
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
    }

    // Check if the order has the correct status before updating
    if (order.orderStatus !== 'ready for pickup') {
      // Return specific error based on current status
      switch (order.orderStatus) {
        case 'delivered':
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Order is already delivered'
          );
        case 'canceled':
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Order is canceled');
        case 'preparing':
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Order is still preparing'
          );
        case 'pending':
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Order is still pending');
        default:
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Order cannot be delivered from status: ${order.orderStatus}`
          );
      }
    }
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: 'delivered' },
      { new: true }
    ).populate('shopId', 'userId');

    // Send notifications in parallel
    const notificationPromises = [
      // User notification
      sendNotifications({
        receiver: updatedOrder?.userId,
        text: `Your order ${updatedOrder?.orderNumber} has been delivered`,
        type: 'DELIVERY',
        amount: updatedOrder?.totalAmount,
      }),
      // Business notification

      sendNotifications({
        receiver: updatedOrder?.shopId?._id,
        text: `Order ${updatedOrder?.orderNumber} has been delivered`,
        type: 'DELIVERY',
        amount: updatedOrder?.totalAmount,
      }),
    ];

    // Wait for both notifications to be sent
    await Promise.all(notificationPromises);

    return updatedOrder;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to confirm order delivery'
    );
  }
};
//  refund order
// const refundOrder = async (orderId: string) => {
//   const order: any = await OrderModel.findById(orderId).populate({
//     path: 'shopId',
//     select: 'revenue',
//   });
//   if (!order) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
//   }
//   // Check if the order is eligible for refund
//   if (order.orderStatus !== 'pending' && order.orderStatus !== 'canceled') {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Order cannot be refunded after it is completed or delivered'
//     );
//   }
//   // Ensure that paymentIntentId exists
//   if (!order.paymentIntentId) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'PaymentIntent ID not found');
//   }
//   const adminFeeAmount = Math.floor(
//     (order.totalAmount * order.shopId.revenue) / 100
//   );
//   const remainingAmount = order.totalAmount - adminFeeAmount;
//   try {
//     // Process the refund with Stripe
//     const refund = await stripe.refunds.create({
//       payment_intent: order.paymentIntentId,
//       amount: Math.floor(remainingAmount * 100),
//     });
//     // Use a transaction for payment and order status updates if necessary
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//       await PaymentModel.findOneAndUpdate(
//         { paymentIntentId: order.paymentIntentId },
//         {
//           paymentStatus: 'refunded',
//         },
//         { session }
//       );
//       order.orderStatus = 'canceled';

//       const data = {
//         receiver: order.userId,
//         text: `Your refund (ID: ${refund.id}) of ${remainingAmount} USD has been successfully processed.`,
//         type: 'REFUND',
//         amount: remainingAmount,
//       };
//       await order.save({ session });
//       await sendNotifications(data);
//       await session.commitTransaction();
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//     return refund;
//   } catch (error: any) {
//     console.error('Stripe refund error:', error.message);
//     throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Refund failed');
//   }
// };
export const OrderService = {
  getOrderCompleteItemfromDb,
  getOrderUpcomingfromDb,
  getOrderfromDb,
  updateOrderStatus,
  getSingleDataFromDb,
  orderTotalAnalysisFromDb,
  cancelOrder,
  getCancelOrder,
  confirmOrderStatusUser,
};
