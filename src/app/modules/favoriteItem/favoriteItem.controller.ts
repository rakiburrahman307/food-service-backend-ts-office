import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FavoriteItemService } from './favoriteItem.service';

const createFevItem = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const itemId = req.params.id;
  const result = await FavoriteItemService.addFevItem(id, itemId);
  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Favorite item ${
      result === true ? 'removed' : 'added'
    } successfully`,
    data: result === true ? {} : result,
  });
});
const getFevItems = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const query = req.query;
  const result = await FavoriteItemService.getFevItemsFromDb(id, query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Favorite items retrieved successfully',
    data: result,
  });
});

export const FavoriteItemController = {
  createFevItem,
  getFevItems,
};
