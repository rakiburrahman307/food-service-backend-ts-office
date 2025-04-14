import express from 'express';
import { FeedbackController } from './feedback.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { FeedbackValidation } from './feedback.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-feedback',
  auth(USER_ROLES.USER),
  validateRequest(FeedbackValidation.feedbackSchema),
  FeedbackController.createFeedback
);
router.get('/:id', FeedbackController.getFeedbacks);
router.get('/count/:id', FeedbackController.getFeedbacksCount);

export const FeedbackRoutes = router;
