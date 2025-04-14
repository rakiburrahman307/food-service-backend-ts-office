import express from 'express';
import { AdminDashboardController } from './adminDashboard.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.totalAnalysis
);
router.get(
  '/pie-chart',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.pieChartAnalysis
);
router.get(
  '/order-chart',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.orderChartAnalysis
);
router.get(
  '/revenue',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.totalRevenueAnalysis
);
router.get(
  '/customer-map',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminDashboardController.totalCustomerAnalysis
);

export const AdminDashboardRoutes = router;
