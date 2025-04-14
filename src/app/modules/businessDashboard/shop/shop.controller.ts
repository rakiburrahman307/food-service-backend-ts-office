import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ShopService } from './shop.service';
import { updateShopsWithTopCategories } from '../../../../helpers/updateCategory';

const createShop = catchAsync(async (req, res) => {
  const user: any = req.user;
  const { ...shopData } = req.body;
  const result = await ShopService.createShop(user, shopData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Shop Created successfully',
    data: result,
  });
});
const updateShop = catchAsync(async (req, res) => {
  const user: any = req.user;
  const id = req?.params?.id;
  const { ...shopData } = req.body;
  const result = await ShopService.updateShopInfo(user, id, shopData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop updated successfully',
    data: result,
  });
});
const shopOffStatus = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  await ShopService.toggleShopOffStatus(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop off status updated successfully',
    data: {},
  });
});
const deleteShop = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  await ShopService.deleteShop(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop deleted successfully',
    data: {},
  });
});
const getSingleShop = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await ShopService.getShop(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop retrieved successfully',
    data: result,
  });
});
const getAllShop = catchAsync(async (req, res) => {
  const user: any = req.user;
  const result = await ShopService.getAllShop(user, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop data retrieved successfully',
    data: result,
  });
});
const getTopCategoris = catchAsync(async (req, res) => {
  const shopId = req.params.id;
  const result = await updateShopsWithTopCategories(shopId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop categoris successfully',
    data: result,
  });
});

export const ShopController = {
  createShop,
  updateShop,
  deleteShop,
  shopOffStatus,
  getSingleShop,
  getAllShop,
  getTopCategoris
};
