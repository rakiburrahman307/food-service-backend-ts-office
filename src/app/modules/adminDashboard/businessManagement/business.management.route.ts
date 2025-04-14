import express from 'express';
import { BusinessManagementController } from './business.management.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import validateRequest from '../../../middlewares/validateRequest';
import { BusinessManagementValidation } from './business.management.validation';

const router = express.Router();

router.get(
  '/get-shops',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusinessManagementController.getAllShops
);
router.get(
  '/get-shops-offers',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusinessManagementController.getAllShopsOffers
);

router.patch(
  '/update-shop-revenue/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(BusinessManagementValidation.updateRevenue),
  BusinessManagementController.updateShopRevenue
);
router.patch(
  '/update-shop-status/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(BusinessManagementValidation.updateShopStatus),
  BusinessManagementController.updateShopStatus
);
router.patch(
  '/update-offer-status/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(BusinessManagementValidation.updateShopStatus),
  BusinessManagementController.updateShopsOfferStatus
);

export const BusinessManagementRoutes = router;
