import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { HomeService } from './home.service';

const getAllProductsFromDb = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await HomeService.getProducts(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products retrieved successfully',
    data: result,
  });
});
const getAllShopFromDb = catchAsync(async (req, res) => {
  const result = await HomeService.getShops(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shops retrieved successfully',
    data: result,
  });
});
const getSpacificShopFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HomeService.getSpecificShops(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop retrieved successfully',
    data: result,
  });
});
const getSpacificShopItemsFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = req.query;
  const result = await HomeService.getSpecificShopsItems(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All items retrieved successfully',
    data: result,
  });
});
const getItemFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HomeService.getItemfromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Item retrieve successfully',
    data: result,
  });
});

const getCategorys = catchAsync(async (req, res) => {
  const result = await HomeService.getCategorys();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: result,
  });
});

export const HomeController = {
  getAllProductsFromDb,
  getAllShopFromDb,
  getSpacificShopFromDb,
  getSpacificShopItemsFromDb,
  getItemFromDb,
  getCategorys,
};
