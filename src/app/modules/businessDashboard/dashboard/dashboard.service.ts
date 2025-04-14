import OrderModel from '../../orders/orders.model';
import { User } from '../../user/user.model';
import MealModel from '../meal/meal.model';
import ShopModel from '../shop/shop.model';
// total food sell
const getTotalFoodSell = async (userId: string) => {
  const shops = await ShopModel.find({
    userId,
  });
  const shopIds = shops.map(shop => shop._id);

  const totalFoodSell = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        orderStatus: { $ne: 'canceled' },
      },
    },
    { $unwind: '$products' },
    {
      $group: {
        _id: null,
        totalSell: {
          $sum: '$products.quantity',
        },
      },
    },
  ]);

  return totalFoodSell[0]?.totalSell || 0;
};

// total food sell per year
const getTotalFoodSellPerYear = async (userId: string, year: number) => {
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);
  const totalFoodSell = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    { $unwind: '$products' },
    {
      $group: {
        _id: null,
        totalSell: {
          $sum: { $sum: ['$products.quantity'] },
        },
      },
    },
  ]);

  const totalSold = totalFoodSell[0]?.totalSell || 0;
  const maxExpectedSales = 100000;
  const percentage = (totalSold / maxExpectedSales) * 100;
  const result = Math.min(percentage, 99.9).toFixed(2);

  // Ensure the percentage is never above 100%
  return result;
};
// coustomer growth
const getCustomerGrowth = async (year: number) => {
  try {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);

    const startPrevYear = new Date(`${year - 1}-01-01T00:00:00Z`);
    const endPrevYear = new Date(`${year - 1}-12-31T23:59:59Z`);

    const [result] = await User.aggregate([
      {
        $facet: {
          usersCurrentYear: [
            {
              $match: {
                role: 'USER',
                createdAt: { $gte: startDate, $lte: endDate },
              },
            },
            { $count: 'count' },
          ],
          usersPrevYear: [
            {
              $match: {
                role: 'USER',
                createdAt: { $gte: startPrevYear, $lte: endPrevYear },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Extract counts safely
    const usersCurrentYear = result.usersCurrentYear[0]?.count || 0;
    const usersPrevYear = result.usersPrevYear[0]?.count || 0;

    // Calculate relative percentage growth
    const totalUsers = usersCurrentYear + usersPrevYear;
    const relativePercentage =
      totalUsers > 0 ? (usersCurrentYear / totalUsers) * 100 : 0;

    return Number(relativePercentage.toFixed(2));
  } catch (error) {
    console.error('Error calculating customer growth:', error);
    return null;
  }
};

// total revenue
const getTotalRevenue = async (userId: string) => {
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);

  const orders = await OrderModel.find({
    shopId: { $in: shopIds },
    orderStatus: { $ne: 'canceled' },
  });

  let totalBusinessRevenue = 0;

  orders.forEach(order => {
    // Calculate the business's revenue for this order
    // If revenue is 50%, then business gets 50% of totalAmount
    const adminFeeAmount = Math.floor(
      (order.totalAmount * order?.revenue) / 100
    );
    const remainingAmount = order.totalAmount - adminFeeAmount;
    totalBusinessRevenue += remainingAmount;
  });

  return totalBusinessRevenue;
};
const getTotalRevenuePerYear = async (userId: string, year: number) => {
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

  // Get total revenue for the year
  const totalRevenue = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
  ]);

  const yearRevenue = totalRevenue[0]?.totalRevenue || 0;

  const yearlyRevenueTarget = 100000;
  let percentage = (yearRevenue / yearlyRevenueTarget) * 100;

  percentage = Math.min(percentage, 99.9);

  return parseFloat(percentage.toFixed(1));
};
// Get Total Items for all shops
const getTotalItems = async (userId: string) => {
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);

  const totalItems = await MealModel.countDocuments({
    shopId: { $in: shopIds },
    isDeleted: false,
  });

  return totalItems;
};

// Get Total Shops for the specific user
const getTotalShops = async (userId: string) => {
  const totalShops = await ShopModel.countDocuments({
    userId,
    isDeleted: false,
  });
  return totalShops;
};

// Pie Chart Data
const getPieChartData = async (userId: string, year: number) => {
  const totalFoodSell = await getTotalFoodSellPerYear(userId, year);
  const totalRevenue = await getTotalRevenuePerYear(userId, year);
  const customerGrowth = await getCustomerGrowth(year);

  const data = [
    { name: 'Total Food Sell', value: totalFoodSell },
    { name: 'Customer Growth', value: customerGrowth },
    { name: 'Total Revenue', value: totalRevenue },
  ];

  return data;
};

// Get Order Chart Data for the user
const getOrderChartData = async (userId: string) => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);

  // Aggregate orders by day of the week
  const orderChart = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const orderChartData = daysOfWeek.map((day, index) => {
    const dayData = orderChart.find(item => item._id === index + 1);
    return {
      day,
      totalOrders: dayData ? dayData.totalOrders : 0,
    };
  });

  return orderChartData;
};

// Get Total Revenue Chart Data for monthly
const getTotalRevenueChartData = async (userId: string, year: number) => {
  try {
    // Get all shops for the user
    const shops = await ShopModel.find({ userId });
    const shopIds = shops.map(shop => shop._id);

    // Set date range for the specified year
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

    // Aggregate orders and calculate revenue by month
    const revenueChart = await OrderModel.aggregate([
      {
        $match: {
          shopId: { $in: shopIds },
          orderStatus: { $ne: 'canceled' },
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          totalAmount: 1,
          // Use the revenue field directly from the order model
          // This is the admin's percentage
          revenue: 1,
          // Calculate admin's portion: totalAmount * (revenue / 100)
          adminRevenue: {
            $multiply: ['$totalAmount', { $divide: ['$revenue', 100] }],
          },
        },
      },
      {
        $group: {
          _id: '$month',
          adminRevenue: { $sum: '$adminRevenue' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthsOfYear = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const formattedRevenueChart = monthsOfYear.map((month, index) => {
      const monthData = revenueChart.find(item => item._id === index + 1);
      return {
        month,
        totalRevenue: monthData ? monthData.adminRevenue : 0,
      };
    });

    return formattedRevenueChart;
  } catch (error) {
    console.error('Error in getTotalRevenueChartData:', error);
    throw error;
  }
};

const getCustomerMapData = async (userId: string) => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  // Get all shops owned by the user
  const shops = await ShopModel.find({ userId });
  const shopIds = shops.map(shop => shop._id);

  const customerMap = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $group: {
        _id: { dayOfWeek: { $dayOfWeek: '$createdAt' } },
        totalCustomers: { $sum: 1 },
      },
    },
    {
      $project: {
        dayOfWeek: '$_id.dayOfWeek',
        totalCustomers: 1,
      },
    },
  ]);

  const daysOfWeek = [
    'Sunday', // 1
    'Monday', // 2
    'Tuesday', // 3
    'Wednesday', // 4
    'Thursday', // 5
    'Friday', // 6
    'Saturday', // 7
  ];

  const formattedCustomerMap = daysOfWeek.map((day, index) => {
    const dayData = customerMap.find(item => item.dayOfWeek === index + 1);
    return {
      day,
      totalCustomers: dayData ? dayData.totalCustomers : 0,
    };
  });

  return formattedCustomerMap;
};

export const DashboardAnalyticsService = {
  getTotalFoodSell,
  getTotalRevenue,
  getTotalItems,
  getTotalShops,
  getPieChartData,
  getOrderChartData,
  getTotalRevenueChartData,
  getCustomerMapData,
};
