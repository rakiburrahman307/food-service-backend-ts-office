import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import parseFileData from '../../middlewares/parseFileData';
const router = express.Router();

router
  .route('/profile')
  .get(
    auth(
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.BUSINESSMAN
    ),
    UserController.getUserProfile
  )
  .patch(
    auth(
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.BUSINESSMAN
    ),
    fileUploadHandler(),
    parseFileData,
    validateRequest(UserValidation.updateUserZodSchema),
    UserController.updateProfile
  );

router
  .route('/')
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  );
router.patch(
  '/location',
  auth(USER_ROLES.USER),
  validateRequest(UserValidation.updateLocationZodSchema),
  UserController.updateLocation
);
router.post(
  '/create-businessman',
  validateRequest(UserValidation.createBusinessUserZodSchema),
  UserController.createBusinessman
);

router.post(
  '/recent-search',
  auth(USER_ROLES.USER),
  UserController.resentSeacch
);
router.get(
  '/recent-search',
  auth(USER_ROLES.USER),
  UserController.getResentSeacch
);
router.delete('/delete', auth(USER_ROLES.USER), UserController.deleteProfile);

export const UserRoutes = router;
