import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { AdminDashboardService } from './adminDashboard.service';

// total analysis
const totalAnalysis = catchAsync(async (req, res) => {
  const totalFoodSell = await AdminDashboardService.getTotalFoodSell();
  const totalShop = await AdminDashboardService.getTotalShops();
  const totalUser = await AdminDashboardService.getTotalUser();
  const totalRevenue = await AdminDashboardService.totalRevenue();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total analysis retrieved successfully',
    data: {
      totalFoodSell,
      totalShop,
      totalUser,
      totalRevenue,
    },
  });
});

// total pie charts
const pieChartAnalysis = catchAsync(async (req, res) => {
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
  const result = await AdminDashboardService.getPieChartData(yearInt);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total pie analysis retrieved successfully',
    data: result,
  });
});
// total order chat analysis
const orderChartAnalysis = catchAsync(async (req, res) => {
  const result = await AdminDashboardService.getOrderChartData();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total order analysis retrieved successfully',
    data: result,
  });
});

// total revenue
const totalRevenueAnalysis = catchAsync(async (req, res) => {
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
  const result = await AdminDashboardService.getTotalRevenueChartData(yearInt);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total revenue analysis retrieved successfully',
    data: result,
  });
});
const totalCustomerAnalysis = catchAsync(async (req, res) => {
  const result = await AdminDashboardService.getCustomerMapData();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total customer analysis retrieved successfully',
    data: result,
  });
});

export const AdminDashboardController = {
  totalAnalysis,
  pieChartAnalysis,
  orderChartAnalysis,
  totalRevenueAnalysis,
  totalCustomerAnalysis,
};
