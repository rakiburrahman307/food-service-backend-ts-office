import ShopModel from '../../businessDashboard/shop/shop.model';
import OrderModel from '../../orders/orders.model';
import { User } from '../../user/user.model';

// Get Total Shops for the specific user
const getTotalShops = async () => {
  const totalShops = await ShopModel.countDocuments({ isDeleted: false });
  return totalShops;
};
// Get Total Shops for the specific user
const getTotalUser = async () => {
  const totalShops = await User.countDocuments({
    isDeleted: false,
    status: 'active',
  });
  return totalShops;
};
// Get Total Shops for the specific user
const getTotalFoodSell = async () => {
  const totalSell = await OrderModel.find({
    orderStatus: 'delivered',
  }).countDocuments();
  return totalSell;
};

// total admin revenue
const totalRevenue = async () => {
  const totalRevenueData = await OrderModel.aggregate([
    { $match: { orderStatus: 'delivered' } },
    {
      $project: {
        adminRevenue: {
          $multiply: ['$totalAmount', { $divide: ['$revenue', 100] }],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAdminRevenue: { $sum: '$adminRevenue' },
      },
    },
    {
      $project: {
        _id: 0,
        totalAdminRevenue: 1,
      },
    },
  ]);

  return totalRevenueData.length > 0
    ? totalRevenueData[0].totalAdminRevenue
    : 0;
};

// total sell par year
const getTotalFoodSellPerYear = async (year: number) => {
  const shops = await ShopModel.find({});
  const shopIds = shops.map(shop => shop._id);
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);
  const totalFoodSell = await OrderModel.aggregate([
    {
      $match: {
        shopId: { $in: shopIds },
        orderStatus: 'delivered',
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
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

  return result;
};
// coustomer growth
const getCustomerGrowth = async (year: number) => {
  try {
    const startDateCurrent = new Date(year, 0, 1);
    const endDateCurrent = new Date(year, 11, 31, 23, 59, 59, 999);

    const startDatePrev = new Date(year - 1, 0, 1);
    const endDatePrev = new Date(year - 1, 11, 31, 23, 59, 59, 999);

    const [result] = await User.aggregate([
      {
        $facet: {
          usersPrevYear: [
            {
              $match: { createdAt: { $gte: startDatePrev, $lte: endDatePrev } },
            },
            { $count: 'count' },
          ],
          usersCurrentYear: [
            {
              $match: {
                createdAt: { $gte: startDateCurrent, $lte: endDateCurrent },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Ensure result exists and contains data
    const usersPrevYear = result?.usersPrevYear?.length
      ? result.usersPrevYear[0].count
      : 0;
    const usersCurrentYear = result?.usersCurrentYear?.length
      ? result.usersCurrentYear[0].count
      : 0;

    const totalUsers = usersCurrentYear + usersPrevYear;

    // Calculate relative percentage growth
    const relativePercentage =
      totalUsers > 0 ? (usersCurrentYear / totalUsers) * 100 : 0;

    return Number(relativePercentage.toFixed(2));
  } catch (error) {
    console.error('Error calculating customer growth:', error);
    return 0;
  }
};

// total revenue per year as percentage (capped at 100%)
const getTotalRevenuePerYear = async (year: number) => {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const totalRevenueData = await OrderModel.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'shops',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shopData',
        },
      },
      { $unwind: '$shopData' },

      {
        $group: {
          _id: '$shopData._id',
          totalRevenue: { $sum: '$totalAmount' },
          shopRevenuePercentage: { $first: '$shopData.revenue' },
        },
      },

      {
        $project: {
          _id: 0,
          totalAmountForAdmin: {
            $multiply: [
              '$totalRevenue',
              { $divide: ['$shopRevenuePercentage', 100] },
            ],
          },
        },
      },
    ]);
    const totalAdminRevenue = totalRevenueData.reduce(
      (sum, shop) => sum + (shop.totalAmountForAdmin || 0),
      0
    );
    const yearlyTarget = 100000;
    let percentage = (totalAdminRevenue / yearlyTarget) * 100;
    percentage = Math.min(percentage, 100);

    return parseFloat(percentage.toFixed(1));
  } catch (error) {
    console.error(
      'Error calculating total revenue percentage per year:',
      error
    );
    return 0;
  }
};

// Pie Chart Data letest 7 days
const getPieChartData = async (year: number) => {
  const totalFoodSell = await getTotalFoodSellPerYear(year);
  const totalRevenue = await getTotalRevenuePerYear(year);
  const customerGrowth = await getCustomerGrowth(year);

  const data = [
    { name: 'Total Food Sell', value: totalFoodSell },
    { name: 'Customer Growth', value: customerGrowth },
    { name: 'Total Revenue', value: totalRevenue },
  ];

  return data;
};
// Get Order Chart Data for the user letest 7 days
const getOrderChartData = async () => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  const shops = await ShopModel.find({});
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
// Get Total Revenue Chart Data for monthly
const getTotalRevenueChartData = async (year: number) => {
  try {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

    const revenueChart = await OrderModel.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          adminRevenue: {
            $multiply: ['$totalAmount', { $divide: ['$revenue', 100] }],
          },
        },
      },
      {
        $group: {
          _id: '$month',
          totalAdminRevenue: { $sum: '$adminRevenue' },
          count: { $sum: 1 },
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
        totalRevenue: monthData ? monthData.totalAdminRevenue : 0,
      };
    });

    return formattedRevenueChart;
  } catch (error) {
    console.error('Error in getTotalRevenueChartData:', error);
    throw error;
  }
};
// Get Customer Map Data
const getCustomerMapData = async () => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const customerMap = await OrderModel.aggregate([
      {
        $match: {
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
          _id: { $dayOfWeek: '$createdAt' },
          totalCustomers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          _id: 0,
          dayOfWeek: '$_id',
          totalCustomers: { $size: '$totalCustomers' },
        },
      },
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

    const formattedCustomerMap = daysOfWeek.map((day, index) => {
      const dayData = customerMap.find(item => item.dayOfWeek === index + 1);
      return {
        day,
        totalCustomers: dayData ? dayData.totalCustomers : 0,
      };
    });

    return formattedCustomerMap;
  } catch (error) {
    console.error('Error fetching customer map data:', error);
    return [];
  }
};

export const AdminDashboardService = {
  getTotalShops,
  getTotalUser,
  getTotalFoodSell,
  totalRevenue,
  getPieChartData,
  getOrderChartData,
  getTotalRevenueChartData,
  getCustomerMapData,
};
