import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import uploadFileHandler from '../../../middlewares/uploadFileHandler';
import validateRequest from '../../../middlewares/validateRequest';
import { MealController } from './meal.controller';
import { MealValidation } from './meal.validation';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/create-meal',
  auth(USER_ROLES.BUSINESSMAN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

  validateRequest(MealValidation.createMealSchema),
  MealController.createMeal
);

export const MealRoutes = router;
