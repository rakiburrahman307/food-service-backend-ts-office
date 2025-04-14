import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router.get(
  '/payments',
  auth(USER_ROLES.USER),
  PaymentController.getPaymentsInfo
);
router.get(
  '/:id',
  auth(USER_ROLES.USER),
  PaymentController.getSpacificPaymentsInfo
);
router.post(
  '/retrieve-payment',
  auth(USER_ROLES.USER),
  validateRequest(PaymentValidation.paymentSchema),
  PaymentController.confirmPayment
);
router.post(
  '/create-payment',
  auth(USER_ROLES.USER),
  PaymentController.createPaymentIntent
);
router.post("create-accaunt",auth(USER_ROLES.BUSINESSMAN))

export const PaymentRoutes = router;
