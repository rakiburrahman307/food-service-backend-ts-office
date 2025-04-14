import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IFeedbackPropes } from './feedback.interface';
import FeedbackModel from './feedback.model';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import ShopModel from '../businessDashboard/shop/shop.model';

const createFeedbackToDB = async (payload: IFeedbackPropes) => {
  const createFeedback = await FeedbackModel.create(payload);
  if (!createFeedback) {
    throw new ApiError(StatusCodes.CREATED, 'Failed to create feedback');
  }

  const feedbackStats = await FeedbackModel.aggregate([
    {
      $match: { shopId: new mongoose.Types.ObjectId(payload.shopId) },
    },
    {
      $group: {
        _id: '$shopId',
        totalFeedbackCount: { $sum: 1 },
        averageRating: { $avg: '$ratings' },
      },
    },
  ]);

  if (feedbackStats.length > 0) {
    const { totalFeedbackCount, averageRating } = feedbackStats[0];
    await ShopModel.findByIdAndUpdate(payload.shopId, {
      $set: {
        avarageRating: averageRating.toFixed(1),
        totalFeedback: totalFeedbackCount,
      },
    });
  }

  return createFeedback;
};
const getallFeedbacks = async (id: string, params: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    FeedbackModel.find({ shopId: id }),
    params
  );
  const feedbacks = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['userId'], {})
    .modelQuery.exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { feedbacks, pagination };
};
const getFeedbackCount = async (id: string) => {
  const feedbackData = await FeedbackModel.aggregate([
    {
      $match: { shopId: new mongoose.Types.ObjectId(id) },
    },
    {
      $group: {
        _id: '$shopId',
        totalFeedbackCount: { $sum: 1 },
        averageRating: { $avg: '$ratings' },
      },
    },
  ]);

  if (feedbackData.length === 0) {
    return { totalFeedbackCount: 0, averageRating: 0 };
  }
  return {
    totalFeedbackCount: feedbackData[0].totalFeedbackCount,
    averageRating: feedbackData[0].averageRating.toFixed(2),
  };
};
export const FeedbackService = {
  createFeedbackToDB,
  getallFeedbacks,
  getFeedbackCount,
};
