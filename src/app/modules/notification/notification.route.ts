import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.USER,
    USER_ROLES.BUSINESSMAN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  NotificationController.getNotificationFromDB
);
router.get(
  '/admin',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.adminNotificationFromDB
);
router.patch(
  '/:id',
  auth(
    USER_ROLES.USER,
    USER_ROLES.BUSINESSMAN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  NotificationController.readNotification
);
router.patch(
  '/admin',
  auth(USER_ROLES.USER),
  NotificationController.adminReadNotification
);

export const NotificationRoutes = router;
