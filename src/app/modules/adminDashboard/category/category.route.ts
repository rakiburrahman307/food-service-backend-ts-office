import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';
import { getSingleFilePath } from '../../../../shared/getFilePath';

const router = express.Router();

router.get(
  '/get-category',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.BUSINESSMAN,
    USER_ROLES.USER,
    USER_ROLES.SUPER_ADMIN
  ),
  CategoryController.getCategroys
);
router.post(
  '/create-category',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const image = getSingleFilePath(req.files, 'image');
    const data = JSON.parse(req.body.data);
    req.body = { image, ...data };
    next();
  },
  validateRequest(CategoryValidation.categorySchema),
  CategoryController.createCategroy
);
router.patch(
  '/update-category/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const image = getSingleFilePath(req.files, 'image');
    const data = JSON.parse(req.body.data);
    req.body = { image, ...data };
    next();
  },
  validateRequest(CategoryValidation.categoryUpdateSchema),
  CategoryController.updateCategroy
);
router.patch(
  '/toggle-status/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(CategoryValidation.categoryStatusUpdateSchema),
  CategoryController.updateSatusCategroy
);
router.delete(
  '/delete-category/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  CategoryController.deleteCategroy
);

export const CategoryRoutes = router;
