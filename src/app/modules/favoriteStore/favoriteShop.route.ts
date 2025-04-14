import express from 'express';
import { FavoriteShopController } from './favoriteShop.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/shop/:id',
  auth(USER_ROLES.USER),
  FavoriteShopController.createFevShop
);
router.get('/shops', auth(USER_ROLES.USER), FavoriteShopController.getFevShops);

export const FavoriteShopRoutes = router;
