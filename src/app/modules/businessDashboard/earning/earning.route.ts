import express from 'express';
import { EarningController } from './earning.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();

router.get(
  '/earning',
  auth(USER_ROLES.BUSINESSMAN),
  EarningController.getEarningInfo
);
// router.get(
//   '/earning/:shopId',
//   auth(USER_ROLES.BUSINESSMAN),
//   EarningController.getEarningInfo
// );
router.get(
  '/earning/detail/:id',
  auth(USER_ROLES.BUSINESSMAN),
  EarningController.getSpecificEarningInfo
);

export const EarningRoutesBusiness = router;
