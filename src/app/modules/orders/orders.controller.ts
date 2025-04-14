import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './orders.service';

const getOrdersIsCompleated = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const query = req.query;
  const orders = await OrderService.getOrderCompleteItemfromDb(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Complete order retrieved successfully',
    data: orders.complete,
    pagination: orders.meta,
  });
});
const getOrdersIsUpcoming = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const query = req.query;
  const orders = await OrderService.getOrderUpcomingfromDb(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Upcoming order retrieved successfully',
    data: orders.upcoming,
    pagination: orders.meta,
  });
});
const getOrders = catchAsync(async (req, res) => {
  const shopId = req.params.shopId;
  const query = req.query;
  console.log(req.query);
  const orders = await OrderService.getOrderfromDb(shopId, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrieved successfully',
    data: orders,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await OrderService.updateOrderStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order status updated successfully',
    data: result,
  });
});
const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orders = await OrderService.getSingleDataFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrieved successfully',
    data: orders,
  });
});
const orderTotalAnalysis = catchAsync(async (req, res) => {
  const { id } = req.params;
  const analysis = await OrderService.orderTotalAnalysisFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order analysis successfully',
    data: analysis,
  });
});
const getCancelOrder = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const result = await OrderService.getCancelOrder(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cancel order retrieved successfully',
    data: result,
  });
});
const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.cancelOrder(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order cancel successfully',
    data: result,
  });
});
// const refundOrder = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await OrderService.refundOrder(id);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Order refurnd successfully',
//     data: result,
//   });
// });
const confirmOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.confirmOrderStatusUser(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order has been confirm successfully',
    data: result,
  });
});

export const OrderController = {
  getOrdersIsCompleated,
  getOrdersIsUpcoming,
  getOrders,
  updateOrderStatus,
  getSingleOrder,
  orderTotalAnalysis,
  getCancelOrder,
  cancelOrder,
  confirmOrderStatus,
};
