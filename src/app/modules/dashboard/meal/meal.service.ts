import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { IMeal } from './meal.interface';
import MealModel from './meal.model';
import ShopModel from '../shop/shop.model';
import { TFiles } from '../../../../types/files';

const createMealIntoDb = async (file: TFiles, payload: IMeal) => {
  const imageData = file.image[0];
  if (imageData.fieldname && imageData.fieldname === 'image') {
    payload.image = imageData.path;
  }
  const shopExists = await ShopModel.isExistShopById(payload.shopId);
  if (!shopExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }

  const createMeal = await MealModel.create(payload);
  if (!createMeal) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create meal');
  }
  return createMeal;
};
const updateMealIntoDb = async () => {};
const deleteMealIntoDb = async () => {};

export const MaelService = {
  createMealIntoDb,
  updateMealIntoDb,
  deleteMealIntoDb,
};
