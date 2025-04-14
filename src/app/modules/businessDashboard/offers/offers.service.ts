import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { TFiles } from '../../../../types/files';
import { TOfffer } from './offers.interface';
import OfferModel from './offers.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import MealModel from '../meal/meal.model';
// creat offer service

const createOfferInToDb = async (payload: TOfffer) => {
  const createOffer = await OfferModel.create(payload);
  if (!createOffer) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create offer');
  }
  return createOffer;
};

// update offer status service
const updtaeOfferStatusInToDb = async (id: string, payload: string) => {
  // Check if offer exists
  const offerExists = await OfferModel.findById(id);
  if (!offerExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Offer not found');
  }

  // Check if the associated item exists
  const isItemExists = await MealModel.findById(offerExists.itemId);
  if (!isItemExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  // Process based on the payload status
  if (payload === 'completed') {
    await MealModel.findByIdAndUpdate(
      offerExists.itemId,
      { offerPrice: isItemExists.price, offerStatus: false },
      { new: true }
    );

    // Update the offer status to 'completed'
    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      { status: payload },
      { new: true }
    );

    if (!updatedOffer) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update offer status'
      );
    }

    return updatedOffer;
  }

  // const updateStatus = await OfferModel.findByIdAndUpdate(
  //   id,
  //   { status: payload },
  //   { new: true }
  // );
  // if (!updateStatus) {
  //   throw new ApiError(
  //     StatusCodes.INTERNAL_SERVER_ERROR,
  //     'Failed to update status'
  //   );
  // }

  // return updateStatus;
};
// get single offer service
const getSingleOffer = async (id: string) => {
  const offer = await OfferModel.findById(id);
  if (!offer) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Offer not found');
  }
  return offer;
};

// get all offers service
const getAllOffers = async (shopId: string, query: Record<string, unknown>) => {
  const currentDate = new Date();
  const queryBuilder = new QueryBuilder(OfferModel.find({ shopId }), query);
  queryBuilder
    .search(['shopName', 'itemName', 'offerTitle', 'shopCategory'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['shopId', 'itemId'], {
      shopId: 'shopName',
      itemId: 'name category',
    });

  // Execute the query to get offers
  const offers = await queryBuilder.modelQuery.exec();
  for (const offer of offers) {
    const { itemId, endDate, status } = offer;
    const offerEndDate = new Date(endDate);

    if (offerEndDate < currentDate && status !== 'completed') {
      const item = await MealModel.findById(itemId);
      if (!item) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'Failed to update offer status'
        );
      }
      await MealModel.findOneAndUpdate(
        { _id: itemId },
        { $set: { offerPrice: item.price } },
        { new: true }
      );
      await OfferModel.findByIdAndUpdate(
        offer._id,
        { $set: { status: 'completed' } },
        { new: true }
      );
    }
  }
  const pagination = await queryBuilder.getPaginationInfo();
  return {
    offers,
    pagination,
  };
};

export const OffersService = {
  createOfferInToDb,
  getSingleOffer,
  updtaeOfferStatusInToDb,
  getAllOffers,
};
