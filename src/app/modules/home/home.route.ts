import express from 'express';
import { HomeController } from './home.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/products', HomeController.getAllProductsFromDb);
router.get(
  '/shops',
  auth(USER_ROLES.GUEST, USER_ROLES.USER),
  HomeController.getAllShopFromDb
);
router.get('/shop/:id', HomeController.getSpacificShopFromDb);
router.get('/shop/:id/items', HomeController.getSpacificShopItemsFromDb);
router.get(
  '/product/:id',
  HomeController.getItemFromDb
);
router.get('/categories', HomeController.getCategorys);
export const HomeRoutes = router;
