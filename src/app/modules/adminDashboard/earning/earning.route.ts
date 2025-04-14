import express from 'express';
import { EarningController } from './earning.controller';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.get(
  '/earnings',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  EarningController.getEarningProducts
);
router.get(
  '/earnings/:productId',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  EarningController.getSingleEarningProduct
);

export const EarningRoutes = router;
