import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ShopRoutes } from '../app/modules/businessDashboard/shop/shop.route';
import { MealRoutes } from '../app/modules/businessDashboard/meal/meal.route';
import { OffersRoutes } from '../app/modules/businessDashboard/offers/offers.route';
import { CategoryRoutes } from '../app/modules/adminDashboard/category/category.route';
import { userManagementRoutes } from '../app/modules/adminDashboard/usersManagement/user.managment.route';
import { BusinessManagementRoutes } from '../app/modules/adminDashboard/businessManagement/business.management.route';
import { HomeRoutes } from '../app/modules/home/home.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { FeedbackRoutes } from '../app/modules/feedback/feedback.route';
import { FavoriteShopRoutes } from '../app/modules/favoriteStore/favoriteShop.route';
import { FavoriteItemRoutes } from '../app/modules/favoriteItem/favoriteItem.route';
import { OfferRoutes } from '../app/modules/offer/offer.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { OrderRoutes } from '../app/modules/orders/orders.route';
import { DashboardRoutes } from '../app/modules/businessDashboard/dashboard/dashboard.route';
import { AdminDashboardRoutes } from '../app/modules/adminDashboard/adminDashboard/adminDashboard.route';
import { EarningRoutes } from '../app/modules/adminDashboard/earning/earning.route';
import { EarningRoutesBusiness } from '../app/modules/businessDashboard/earning/earning.route';
import { HelpRoutes } from '../app/modules/contactUs/contact.route';
import { AlertRoutes } from '../app/modules/alert/alert.route';
import SettingsRouter from '../app/modules/sattings/sattings.route';
import { PayfastRoutes } from '../app/modules/businessDashboard/payfast/payfast.route';

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
  {
    path: '/dashboard',
    route: OffersRoutes,
  },

  {
    path: '/dashboard',
    route: PayfastRoutes,
  },
  {
    path: '/admin/dashboard',
    route: CategoryRoutes,
  },
  {
    path: '/admin/dashboard',
    route: userManagementRoutes,
  },
  {
    path: '/admin/dashboard',
    route: BusinessManagementRoutes,
  },
  {
    path: '/admin/dashboard',
    route: AdminDashboardRoutes,
  },
  {
    path: '/admin/dashboard',
    route: EarningRoutes,
  },
  {
    path: '/admin/dashboard',
    route: HelpRoutes,
  },
  {
    path: '/home',
    route: HomeRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/fevorite',
    route: FavoriteShopRoutes,
  },
  {
    path: '/fevorite',
    route: FavoriteItemRoutes,
  },
  {
    path: '/offers',
    route: OfferRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
 
  {
    path: '/contact',
    route: HelpRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/dashboard',
    route: HelpRoutes,
  },
  {
    path: '/alerts',
    route: AlertRoutes,
  },
  {
    path: '/dashboard',
    route: EarningRoutesBusiness,
  },
  {
    path: '/setting',
    route: SettingsRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
