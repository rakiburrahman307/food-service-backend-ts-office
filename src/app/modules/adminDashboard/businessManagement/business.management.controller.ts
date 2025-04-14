import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { BusinessManagementService } from './business.management.service';
// get all the shop
const getAllShops = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await BusinessManagementService.getShopsFromDb(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shops retrieved successful',
    data: result.shops,
    pagination: result.pagination,
  });
});
// update shop revenue
const updateShopRevenue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { revenue } = req.body;
  const result = await BusinessManagementService.updateShopsRevenueFromDb(
    id,
    revenue
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Updated revenue successful',
    data: result,
  });
});
// update shop status
const updateShopStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await BusinessManagementService.updateShopsStatusFromDb(
    id,
    status
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Status updated successful',
    data: result,
  });
});
// get all the shop offers
const getAllShopsOffers = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await BusinessManagementService.getShopsOffersFromDb(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Shops Offer retrieved successful',
    data: result,
  });
});
// update shop offers status
const updateShopsOfferStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await BusinessManagementService.updateShopsOfferStatusFromDb(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer status updated successful',
    data: result,
  });
});

export const BusinessManagementController = {
  getAllShops,
  updateShopRevenue,
  updateShopStatus,
  getAllShopsOffers,
  updateShopsOfferStatus,
};
