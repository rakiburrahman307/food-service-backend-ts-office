import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { MaelService } from './meal.service';

const createMeal = catchAsync(async (req, res) => {
  const file: any = req?.files;
  const result = await MaelService.createMealIntoDb(file, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Meal created successfully',
    data: result,
  });
});
const updateMeal = catchAsync(async (req, res) => {});
const deleteMeal = catchAsync(async (req, res) => {});

export const MealController = {
  createMeal,
  updateMeal,
  deleteMeal,
};
