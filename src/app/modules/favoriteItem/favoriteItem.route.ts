import express from 'express';
import { FavoriteItemController } from './favoriteItem.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/item/:id',
  auth(USER_ROLES.USER),
  FavoriteItemController.createFevItem
);
router.get(
  '/items',
  auth(USER_ROLES.USER),
  FavoriteItemController.getFevItems
);

export const FavoriteItemRoutes = router;
