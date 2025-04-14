import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { EarningService } from './earning.service';

const getEarningInfo = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { shopId, year, month, ...query } = req.query;
  const intYear = parseInt(year as string);
  const intMonth = parseInt(month as string);
  const result = await EarningService.getEarnings(
    id,
    intYear,
    intMonth,
    shopId,
    query
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Get earning info successful',
    data: result,
  });
});
const getSpecificEarningInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EarningService.getSpecificEarnings(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Get earning product info successful',
    data: result,
  });
});
export const EarningController = { getEarningInfo, getSpecificEarningInfo };
