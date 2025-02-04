import express, { NextFunction, Request, Response } from 'express';
import { ShopController } from './shop.controller';
import uploadFileHandler from '../../../middlewares/uploadFileHandler';
import validateRequest from '../../../middlewares/validateRequest';
import { ShopValidation } from './shop.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { authorizeShopOwnership } from '../../../middlewares/authraizedShopOwner';

const router = express.Router();

router.post(
  '/create-shop',
  auth(USER_ROLES.BUSINESSMAN),
  uploadFileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

  validateRequest(ShopValidation.cretaeShopSchema),
  ShopController.createShop
);
router.patch(
  '/update-shop/:id',
  auth(USER_ROLES.BUSINESSMAN),
  authorizeShopOwnership,
  uploadFileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ShopValidation.cretaeShopSchema),
  ShopController.updateShop
);
router.patch(
  '/shop-off-status/:id',
  auth(USER_ROLES.BUSINESSMAN),
  authorizeShopOwnership,
  ShopController.shopOffStatus
);
router.delete(
  '/delete-shop/:id',
  auth(USER_ROLES.BUSINESSMAN),
  authorizeShopOwnership,
  ShopController.deleteShop
);

export const ShopRoutes = router;
