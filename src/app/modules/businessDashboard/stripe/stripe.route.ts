import express from 'express';
import { StripeController } from './stripe.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
const router = express.Router();

router.post(
  '/create-connected-account',
  auth(USER_ROLES.BUSINESSMAN),
  StripeController.createConnectedAccount
);
router.post(
  '/create-onboarding-link',
  auth(USER_ROLES.BUSINESSMAN),
  StripeController.createOnboardingLink
);
router.post(
  '/verify-accaunt',
  auth(USER_ROLES.BUSINESSMAN),
  StripeController.varifyStripeAccauntStatus
);

export const StripeRoutes = router;
