import express, { NextFunction, Request, Response } from 'express';
import { ShopController } from './shop.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { ShopValidation } from './shop.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { authorizeShopOwnership } from '../../../middlewares/authraizedShopOwner';
import { getSingleFilePath } from '../../../../shared/getFilePath';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
const router = express.Router();
router.get(
  '/all-shops',
  auth(USER_ROLES.BUSINESSMAN),
  ShopController.getAllShop
);
router.get(
  '/get-shop/:id',
  auth(USER_ROLES.BUSINESSMAN),
  ShopController.getSingleShop
);
router.post(
  '/create-shop',
  auth(USER_ROLES.BUSINESSMAN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const banner = getSingleFilePath(req.files, 'banner');
    const logo = getSingleFilePath(req.files, 'logo');
    const data = JSON.parse(req.body.data);
    req.body = { banner, logo, ...data };
    next();
  },
  validateRequest(ShopValidation.cretaeShopSchema),
  ShopController.createShop
);
router.patch(
  '/update-shop/:id',
  auth(USER_ROLES.BUSINESSMAN),
  authorizeShopOwnership,
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const banner = getSingleFilePath(req.files, 'banner');
    const logo = getSingleFilePath(req.files, 'logo');
    const data = JSON.parse(req.body.data);
    req.body = { banner, logo, ...data };
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
router.post(
  '/top-categoris/:id',
  auth(USER_ROLES.BUSINESSMAN),
  ShopController.getTopCategoris
);
export const ShopRoutes = router;
