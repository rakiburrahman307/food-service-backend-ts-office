import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ShopRoutes } from '../app/modules/dashboard/shop/shop.route';
import { MealRoutes } from '../app/modules/dashboard/meal/meal.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/dashboard',
    route: ShopRoutes,
  },
  {
    path: '/dashboard',
    route: MealRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
