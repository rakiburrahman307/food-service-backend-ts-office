import { Request, Response } from 'express';
import { DashboardAnalyticsService } from './dashboard.service';
import sendResponse from '../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';

const getAllAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { id }: any = req.user;
  const totalFoodSell = await DashboardAnalyticsService.getTotalFoodSell(id);
  const totalRevenue = await DashboardAnalyticsService.getTotalRevenue(id);
  const totalItems = await DashboardAnalyticsService.getTotalItems(id);
  const totalShops = await DashboardAnalyticsService.getTotalShops(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Count analytics data retrieved successfully',
    data: {
      totalFoodSell,
      totalRevenue,
      totalItems,
      totalShops,
    },
  });
});

const getPieChartItems = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { year } = req.query;
  if (!year) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Year is required',
    });
  }

  // Convert the year to a number
  const yearInt = parseInt(year as string);
  const result = await DashboardAnalyticsService.getPieChartData(id, yearInt);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Pie chart analytics data retrieved successfully',
    data: result,
  });
});
const getOrderChartItems = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const result = await DashboardAnalyticsService.getOrderChartData(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order analytics data retrieved successfully',
    data: result,
  });
});
const totalRevenue = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const { year } = req.query;
  if (!year) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Year is required',
    });
  }

  // Convert the year to a number
  const yearInt = parseInt(year as string);
  const result = await DashboardAnalyticsService.getTotalRevenueChartData(
    id,
    yearInt
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Revenue chart data retrieved successfully',
    data: result,
  });
});
const totalMapData = catchAsync(async (req, res) => {
  const { id }: any = req.user;

  const result = await DashboardAnalyticsService.getCustomerMapData(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Analytics data retrieved successfully',
    data: result,
  });
});
export const AnalyticsController = {
  getAllAnalytics,
  getPieChartItems,
  getOrderChartItems,
  totalRevenue,
  totalMapData,
};
