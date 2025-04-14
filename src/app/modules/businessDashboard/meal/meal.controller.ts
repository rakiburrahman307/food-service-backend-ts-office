import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { MaelService } from './meal.service';

const createMeal = catchAsync(async (req, res) => {

  const result = await MaelService.createMealIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Meal created successfully',
    data: result,
  });
});
const updateMeal = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await MaelService.updateMealIntoDb(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meal updated successfully',
    data: result,
  });
});
const deleteMeal = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  await MaelService.deleteMealIntoDb(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meal deleted successfully',
    data: {},
  });
});
const toggleMealStatus = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  await MaelService.toggleMealStatus(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meal status updated successful',
    data: {},
  });
});
const getMealsByShopId = catchAsync(async (req, res) => {
  const result = await MaelService.getMeals(req.params?.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meals retrieved successful',
    data: result.meals,
    pagination: result.meta,
  });
});
const getMealById = catchAsync(async (req, res) => {
  const result = await MaelService.getMealById(req.params?.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meal retrieved successful',
    data: result,
  });
});
const getCategorys = catchAsync(async (req, res) => {
  const result = await MaelService.getCategory();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successful',
    data: result,
  });
});

export const MealController = {
  createMeal,
  updateMeal,
  deleteMeal,
  toggleMealStatus,
  getMealsByShopId,
  getMealById,
  getCategorys
};
