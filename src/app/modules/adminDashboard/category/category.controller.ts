import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { CategoryService } from './category.service';

const getCategroys = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CategoryService.getCategoryFromDb(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successful',
    data: result,
  });
});

const createCategroy = catchAsync(async (req, res) => {
  const categroyData = req.body;
  const result = await CategoryService.createCategoryIntoDb(categroyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Create categroy successful',
    data: result,
  });
});
const updateCategroy = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const categroyData = req.body;
  const result = await CategoryService.updateCategoryFromDb(id, categroyData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Update categroy successful',
    data: result,
  });
});
const updateSatusCategroy = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const { status } = req.body;
  const result = await CategoryService.toggoleStatusCategory(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Update status successful',
    data: result,
  });
});
const deleteCategroy = catchAsync(async (req, res) => {
  const { id } = req?.params;
  await CategoryService.deleteCategoryFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Delete category successful',
    data: {},
  });
});
export const CategoryController = {
  getCategroys,
  createCategroy,
  updateCategroy,
  updateSatusCategroy,
  deleteCategroy,
};
