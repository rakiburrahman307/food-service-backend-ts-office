import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { EarningService } from './earning.service';

const getEarningProducts = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await EarningService.getErningdetailsFromDb(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleEarningProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await EarningService.getSingleErningdetailsFromDb(productId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    data: result,
  });
});
export const EarningController = {
  getEarningProducts,
  getSingleEarningProduct,
};
