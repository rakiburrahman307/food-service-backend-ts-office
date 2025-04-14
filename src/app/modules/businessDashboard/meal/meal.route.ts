import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import validateRequest from '../../../middlewares/validateRequest';
import { MealController } from './meal.controller';
import { MealValidation } from './meal.validation';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import {getSingleFilePath } from '../../../../shared/getFilePath';


const router = express.Router();

router.post(
  '/create-meal',
  auth(USER_ROLES.BUSINESSMAN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
     const image = getSingleFilePath(req.files, 'image');
     const data = JSON.parse(req.body.data);
     req.body = { image, ...data };
     next();
   },
  validateRequest(MealValidation.createMealSchema),
  MealController.createMeal
);
router.patch(
  '/update-meal/:id',
  auth(USER_ROLES.BUSINESSMAN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const image = getSingleFilePath(req.files, 'image');
    const data = JSON.parse(req.body.data);
    req.body = { image, ...data };
    next();
  },
  validateRequest(MealValidation.updateMealSchema),
  MealController.updateMeal
);
router.delete(
  '/delete-meal/:id',
  auth(USER_ROLES.BUSINESSMAN),
  MealController.deleteMeal
);
router.patch(
  '/update-meal-status/:id',
  auth(USER_ROLES.BUSINESSMAN),
  MealController.toggleMealStatus
);
router.get(
  '/meals-by-shop/:id',
  auth(USER_ROLES.BUSINESSMAN),
  MealController.getMealsByShopId
);
router.get(
  '/get-meal/:id',
  auth(USER_ROLES.BUSINESSMAN),
  MealController.getMealById
);
router.get(
  '/category',
  auth(USER_ROLES.BUSINESSMAN),
  MealController.getCategorys
);

export const MealRoutes = router;
