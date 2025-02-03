import express, { NextFunction, Request, Response } from 'express';
import { ShopController } from './shop.controller';
import uploadFileHandler from '../../middlewares/uploadFileHandler';
import validateRequest from '../../middlewares/validateRequest';
import { ShopValidation } from './shop.validation';
import dataParseHandler from '../../middlewares/dataParseHandler';

const router = express.Router();

router.post(
  '/create-shop',
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
  uploadFileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ShopValidation.cretaeShopSchema),
  ShopController.updateShop
);
router.patch('/shop-off-status/:id', ShopController.shopOffStatus);
router.delete('/delete-shop/:id', ShopController.deleteShop);

export const ShopRoutes = router;
