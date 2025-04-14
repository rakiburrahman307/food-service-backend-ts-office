import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import QueryBuilder from '../../../builder/QueryBuilder';
import OfferModel from '../../businessDashboard/offers/offers.model';
import ShopModel from '../../businessDashboard/shop/shop.model';
import MealModel from '../../businessDashboard/meal/meal.model';
import OrderModel from '../../orders/orders.model';
// get all shop service
const getShopsFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(ShopModel.find(), query);

  const shops = await queryBuilder
    .search(['shopeName', 'shopOwnerName', 'shopLocation'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['userId'], { userId: 'email phone' })
    .modelQuery.sort({ createdAt: -1 }).lean()
    .exec();
  const totalOrdersPerShop = await OrderModel.aggregate([
    {
      $match: { orderStatus: 'delivered' }, 
    },
    {
      $group: {
        _id: '$shopId', 
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const ordersCountMap = totalOrdersPerShop.reduce((acc, item) => {
    acc[item._id.toString()] = item.totalOrders;
    return acc;
  }, {} as Record<string, number>);

  const shopsWithOrderCounts = shops.map(shop => ({
    ...shop,
    totalOrders: ordersCountMap[shop._id.toString()] || 0,
  }));
  const paginationInfo = await queryBuilder.getPaginationInfo();
  return { shops: shopsWithOrderCounts, pagination: paginationInfo };
};
const updateShopsRevenueFromDb = async (id: string, payload: number) => {
  const isExistShop = await ShopModel.findById(id);
  if (!isExistShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }

  const result = await ShopModel.findByIdAndUpdate(
    id,
    { revenue: payload },
    { new: true }
  );
  if (!result) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update shop revenue'
    );
  }

  return result;
};

// update shop status service
const updateShopsStatusFromDb = async (id: string, payload: string) => {
  const shopExists = await ShopModel.findById(id);
  if (!shopExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  const result = await ShopModel.findByIdAndUpdate(
    id,
    { status: payload },
    { new: true }
  );
  if (!result) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update shop status'
    );
  }
  return result;
};

// get shop offers service
const getShopsOffersFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(OfferModel.find(), query);

  const shops = await queryBuilder
    .search(['shopeName', 'shopOwnerName', 'shopLocation'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['shopId', 'itemId'], {})
    .modelQuery.exec();

  const paginationInfo = await queryBuilder.getPaginationInfo();
  return { shops, pagination: paginationInfo };
};

// update shop offer status service
const updateShopsOfferStatusFromDb = async (id: string, payload: string) => {
  // Check if the offer exists
  const offerExists = await OfferModel.findById(id);
  if (!offerExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Offer not found');
  }

  // Check if the item exists in the MealModel
  const isItemExists = await MealModel.findById(offerExists.itemId);
  if (!isItemExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  // If offer is 'active' and conditions match, update meal offer price
  if (payload === 'active') {
    if (
      offerExists.shopId.toString() === isItemExists.shopId.toString() &&
      offerExists.itemId.toString() === isItemExists._id.toString()
    ) {
      // Update the item offer price if conditions match
      const itemExists = await MealModel.findByIdAndUpdate(
        offerExists.itemId,
        { offerPrice: offerExists.discountPrice, offerStatus: true },
        { new: true }
      );
      if (!itemExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update item');
      }
      // Update the offer status
      const updatedOffer = await OfferModel.findByIdAndUpdate(
        id,
        { status: payload },
        { new: true }
      );
      if (!updatedOffer) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update offer');
      }
      return updatedOffer;
    }
  } else {
    // If not 'active', just update the offer status
    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      { status: payload },
      { new: true }
    );
    if (!updatedOffer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update offer');
    }
    return updatedOffer;
  }
};

export const BusinessManagementService = {
  getShopsFromDb,
  updateShopsRevenueFromDb,
  updateShopsStatusFromDb,
  getShopsOffersFromDb,
  updateShopsOfferStatusFromDb,
};
