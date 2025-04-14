import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { IMeal } from './meal.interface';
import MealModel from './meal.model';
import ShopModel from '../shop/shop.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../../shared/unlinkFile';
import CategoryModel from '../../adminDashboard/category/category.model';
// create meal
const createMealIntoDb = async (payload: IMeal) => {
  console.log(payload.shopId)
  const shopExists = await ShopModel.isExistShopById(payload.shopId);
  if (!shopExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  if (payload.offerPrice === 0) {
    payload.offerPrice = payload.price;
  }

  const createMeal = await MealModel.create(payload);
  if (!createMeal) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create meal');
  }
  return createMeal;
};

// update meal
const updateMealIntoDb = async (id: string, payload: IMeal) => {
  // Check if the shop exists
  const mealExists = await MealModel.findById(id);

  if (!mealExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  if (payload.image) {
    unlinkFile(mealExists.image);
  }

  const updateMeal = await MealModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updateMeal) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update meal');
  }
  return updateMeal;
};

// delete meal
const deleteMealIntoDb = async (id: string) => {
  const mealExists = await MealModel.findById(id);
  if (!mealExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const deleteMeal = await MealModel.findByIdAndUpdate(id, {
    isDeleted: true,
    mealStatus: true,
  });
  if (!deleteMeal) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete meal'
    );
  }
  return deleteMeal;
};
// delete meal
const toggleMealStatus = async (id: string) => {
  const mealExists = await MealModel.findById(id);
  if (!mealExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const updateStatus = await MealModel.findByIdAndUpdate(
    id,
    {
      $set: {
        mealStatus: !mealExists.mealStatus,
      },
    },
    {
      new: true,
    }
  );

  if (!updateStatus) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update meal status'
    );
  }
  return updateStatus;
};

const getMeals = async (id: string, query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(MealModel.find({ shopId: id }), query);

  const meals = await queryBuilder.filter().sort().paginate().fields()
    .modelQuery;

  if (!meals || meals.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meals not found for this shop');
  }
  const meta = await queryBuilder.getPaginationInfo();
  return { meals, meta };
};
const getMealById = async (id: string) => {
  const meals = await MealModel.findById(id);
  if (!meals) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  return meals;
};
const getCategory = async () => {
  const category = await CategoryModel.find({ status: 'active' });
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  return category;
};

export const MaelService = {
  createMealIntoDb,
  updateMealIntoDb,
  deleteMealIntoDb,
  toggleMealStatus,
  getMeals,
  getMealById,
  getCategory,
};
