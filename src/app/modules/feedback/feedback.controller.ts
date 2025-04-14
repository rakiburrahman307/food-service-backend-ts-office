import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedback.service';

const createFeedback = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { shopId, ratings, comments } = req?.body;
  const feedback = { userId, shopId, ratings, comments };
  await FeedbackService.createFeedbackToDB(feedback);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Thank you for feedback',
  });
});

const getFeedbacks = catchAsync(async (req, res) => {
  const shopId = req.params?.id;
  const query = req.query;
  const feedback = await FeedbackService.getallFeedbacks(shopId, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Feedback retrieved successfully',
    data: feedback.feedbacks,
    pagination: feedback.pagination,
  });
});
const getFeedbacksCount = catchAsync(async (req, res) => {
  const shopId = req.params?.id;
  const feedback = await FeedbackService.getFeedbackCount(shopId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total feedback retrieved successfully',
    data: feedback,
  });
});
export const FeedbackController = {
  createFeedback,
  getFeedbacks,
  getFeedbacksCount,
};
