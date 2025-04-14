import express from 'express';
import { OfferController } from './offer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();
router.get(
  '/',
  auth(USER_ROLES.GUEST, USER_ROLES.USER),
  OfferController.getAvailableofferItems
);
export const OfferRoutes = router;
