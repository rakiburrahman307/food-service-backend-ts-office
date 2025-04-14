import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferService } from './offer.service';

const getAvailableofferItems = catchAsync(async (req, res) => {
  const query = req.query;
  const availableItems = await OfferService.getAvailableOfferItem(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Available offer items retrieved successfully',
    data: availableItems.offerItems,
    pagination: availableItems.pagination,
  });
});
const getShopOfferItems = catchAsync(async (req, res) => {
  const shopId = req.params?.id;
  const availableItems = await OfferService.getShopOfferItem(shopId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Available offer items retrieved successfully',
    data: availableItems,
  });
});
export const OfferController = { getAvailableofferItems, getShopOfferItems };
