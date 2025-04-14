import express, { NextFunction, Request, Response } from 'express';
import { OffersController } from './offers.controller';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middlewares/auth';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';
import validateRequest from '../../../middlewares/validateRequest';
import { OffersValidation } from './offres.validation';
import { getSingleFilePath } from '../../../../shared/getFilePath';

const router = express.Router();

router.post(
  '/create-offer',
  auth(USER_ROLES.BUSINESSMAN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const image = getSingleFilePath(req.files, 'image');
    const data = JSON.parse(req.body.data);
    req.body = { image, ...data };
    next();
  },
  validateRequest(OffersValidation.offerSchema),
  OffersController.createOffer
);

router.patch(
  '/update-offer-status/:id',
  auth(USER_ROLES.BUSINESSMAN),
  validateRequest(OffersValidation.updateStatusSchema),
  OffersController.updateOfferStatus
);

router.get(
  '/offer/:id',
  auth(USER_ROLES.BUSINESSMAN),
  OffersController.getOfferById
);

// Only businessman and admin roles are allowed to get all offers
router.get(
  '/offers/:shopId',
  auth(USER_ROLES.BUSINESSMAN),
  OffersController.getAllOffers
);

export const OffersRoutes = router;
