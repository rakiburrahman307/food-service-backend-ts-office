import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PaymentService } from './payment.service';

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount, currency } = req.body;
  // Retrieve the PaymentIntent
  const paymentIntent = await PaymentService.createPayment(amount, currency);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Payment intent was created',
    data: paymentIntent.id,
  });
});
const confirmPayment = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { paymentIntentId, products, totalDiscount, shopId } = req.body;
  // Retrieve the PaymentIntent
  const paymentIntent = await PaymentService.retrievePaymentIntent(
    paymentIntentId
  );

  // Check if the payment intent succeeded
  if (paymentIntent?.status === 'succeeded') {
    //    Store order in MongoDB
    const newOrder: any = await PaymentService.storeOrderWithTransaction(
      paymentIntent,
      id,
      products,
      totalDiscount,
      shopId
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Payment confirmed and order saved.',
      data: newOrder,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Payment not completed. Please try again.',
    });
  }
});

const getPaymentsInfo = catchAsync(async (req, res) => {
  const query = req.query;
  const { id }: any = req.user;

  const result = await PaymentService.paymentInfoFromDb(id, query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payments retrieved successfully.',
    data: result.payments,
    pagination: result.pagination,
  });
});
const getSpacificPaymentsInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentService.specificPaymentInfo(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment info retrieved successfully.',
    data: result,
  });
});

export const PaymentController = {
  confirmPayment,
  getPaymentsInfo,
  getSpacificPaymentsInfo,
  createPaymentIntent,
};
