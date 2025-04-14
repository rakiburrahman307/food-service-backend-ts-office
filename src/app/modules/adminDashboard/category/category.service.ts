import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { TFiles } from '../../../../types/files';
import { ICategroy } from './category.interface';
import CategoryModel from './category.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../../shared/unlinkFile';

// get all categiry
const getCategoryFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(CategoryModel.find(), query);

  // Build the query using chainable methods
  queryBuilder.search(['status']).filter().sort().paginate().fields();

  const category = await queryBuilder.modelQuery.exec();
  const paginationInfo = await queryBuilder.getPaginationInfo();

  return {
    category,
    pagination: paginationInfo,
  };
};
// create category
const createCategoryIntoDb = async (payload: ICategroy) => {
  const result = await CategoryModel.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create category');
  }
  return result;
};
// update category
const updateCategoryFromDb = async (
  id: string,
  payload: ICategroy
) => {
  const isExistCategory = await CategoryModel.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  if (payload.image) {
    unlinkFile(isExistCategory.image);
  }
  const categoryExists = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!categoryExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  return categoryExists;
};

// toogle category status
const toggoleStatusCategory = async (
  id: string,
  payload: Partial<ICategroy>
) => {
  if (!payload) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Status is required');
  }

  // Update category status
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: { status: payload } },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  return updatedCategory;
};

// delete category
const deleteCategoryFromDb = async (id: string) => {
  const categoryExists = await CategoryModel.findByIdAndDelete(id);
  if (!categoryExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }
  return categoryExists;
};

export const CategoryService = {
  getCategoryFromDb,
  createCategoryIntoDb,
  updateCategoryFromDb,
  toggoleStatusCategory,
  deleteCategoryFromDb,
};
