import express from 'express';
import { UserManagementController } from './user.managment.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import validateRequest from '../../../middlewares/validateRequest';
import { UserManagementValidation } from './user.managment.validation';

const router = express.Router();

router.get(
  '/get-all-users',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  UserManagementController.getUsers
);
router.patch(
  '/update-user-status/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(UserManagementValidation.updateUserStatusSchema),
  UserManagementController.updateUserStatus
);

export const userManagementRoutes = router;
