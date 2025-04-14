import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { OffersService } from './offers.service';

// create offer
const createOffer = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await OffersService.createOfferInToDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer created successfully',
    data: result,
  });
});

// update offer status
const updateOfferStatus = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const { status } = req.body;
  const result = await OffersService.updtaeOfferStatusInToDb(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer status updated successfully',
    data: result,
  });
});

// get single offer
const getOfferById = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await OffersService.getSingleOffer(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer retrieved successfully',
    data: result,
  });
});
// get all the offers
const getAllOffers = catchAsync(async (req, res) => {
  const shopId = req.params?.shopId;
  const result = await OffersService.getAllOffers(shopId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All offers retrieved successfully',
    data: result.offers,
    pagination: result.pagination,
  });
});

export const OffersController = {
  createOffer,
  getOfferById,
  updateOfferStatus,
  getAllOffers,
};
