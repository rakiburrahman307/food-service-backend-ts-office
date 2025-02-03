import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ShopService } from './shop.service';

const createShop = catchAsync(async (req, res) => {
  const { ...shopData } = req.body;
  const files: any = req.files;
  const result = await ShopService.createShop(files, shopData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Shop Created successfully',
    data: result,
  });
});
const updateShop = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  console.log(id);
  const { ...shopData } = req.body;
  const files: any = req.files;
  const result = await ShopService.updateShopInfo(id, files, shopData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop updated successfully',
    data: result,
  });
});
const shopOffStatus = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await ShopService.toggleShopOffStatus(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop deleted successfully',
    data: {},
  });
});
const deleteShop = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await ShopService.deleteShop(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shop off status updated successfully',
    data: {},
  });
});

export const ShopController = {
  createShop,
  updateShop,
  deleteShop,
  shopOffStatus,
};
