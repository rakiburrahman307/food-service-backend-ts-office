import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { OrderController } from './orders.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersValidation } from './orders.validation';

const router = express.Router();

router.get(
  '/complete',
  auth(USER_ROLES.USER),
  OrderController.getOrdersIsCompleated
);
router.get(
  '/upcoming',
  auth(USER_ROLES.USER),
  OrderController.getOrdersIsUpcoming
);
router.get(
  '/cancel/orders',
  auth(USER_ROLES.USER),
  OrderController.getCancelOrder
);
router.get(
  '/:shopId',
  auth(USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
  OrderController.getOrders
);
router.get(
  '/detail/:id',
  auth(USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
  OrderController.getSingleOrder
);
router.patch(
  '/:id',
  auth(USER_ROLES.BUSINESSMAN),
  validateRequest(OrdersValidation.updateStatusSchema),
  OrderController.updateOrderStatus
);
router.get(
  '/analysis/:id',
  auth(USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
  OrderController.orderTotalAnalysis
);
router.patch(
  '/cancel-order/:id',
  auth(USER_ROLES.USER),
  OrderController.cancelOrder
);

// router.post(
//   '/refund-order/:id',
//   auth(USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
//   OrderController.refundOrder
// );
router.patch(
  '/confirm-order/:id',
  auth(USER_ROLES.USER),
  OrderController.confirmOrderStatus
);
export const OrderRoutes = router;
