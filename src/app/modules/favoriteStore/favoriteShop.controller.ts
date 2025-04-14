import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FavoriteShopService } from './favoriteShop.service';

const createFevShop = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const shopId = req.params.id;
  const result = await FavoriteShopService.addToFevShop(id, shopId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Favorite Shop ${
      result === false ? 'removed' : 'added'
    } successfully`,
    data: result ? result : {},
  });
});
const getFevShops = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const query = req.query;
  const result = await FavoriteShopService.getFevShopFromDb(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Favorite shop retrieved successfully',
    data: result.favoriteShops,
    pagination: result.pagination,
  });
});
export const FavoriteShopController = {
  createFevShop,
  getFevShops,
};
