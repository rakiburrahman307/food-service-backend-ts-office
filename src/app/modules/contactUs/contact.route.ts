import express from 'express';
import { contactController } from './contact.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
  contactController.createHelpMessage
);
router.get(
  '/help/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  contactController.getSingleHelpMessage
);
router.get(
  '/help',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  contactController.getHelpMessage
);

export const HelpRoutes = router;
