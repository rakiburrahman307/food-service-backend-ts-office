import express from 'express';
import { AnalyticsController } from './dashboard.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.BUSINESSMAN),
  AnalyticsController.getAllAnalytics
);
router.get(
  '/pie-chart',
  auth(USER_ROLES.BUSINESSMAN),
  AnalyticsController.getPieChartItems
);
router.get(
  '/order-chart',
  auth(USER_ROLES.BUSINESSMAN),
  AnalyticsController.getOrderChartItems
);
router.get(
  '/revenue-chart',
  auth(USER_ROLES.BUSINESSMAN),
  AnalyticsController.totalRevenue
);

router.get(
  '/customer-map',
  auth(USER_ROLES.BUSINESSMAN),
  AnalyticsController.totalMapData
);
export const DashboardRoutes = router;
