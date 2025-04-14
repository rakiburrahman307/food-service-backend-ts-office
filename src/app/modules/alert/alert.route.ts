import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AlertControllers } from './alert.controller';

const router = express.Router();

router.get('/', auth(USER_ROLES.USER), AlertControllers.getUserNotifications);
router.put(
  '/',
  auth(USER_ROLES.USER),
  AlertControllers.updateUserNotifications
);

export const AlertRoutes = router;
