import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import QueryBuilder from '../../../builder/QueryBuilder';
import OrderModel from '../../orders/orders.model';
import ShopModel from '../shop/shop.model';

const getEarnings = async (
  userId: string,
  year: number,
  month: number,
  shopId: any,
  query: Record<string, unknown>
) => {
  if (month < 1 || month > 12) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid month. It must be between 1 and 12.'
    );
  }

  let startDate: any = '';
  let endDate: any = '';

  if (year && month) {
    startDate = new Date(Date.UTC(year, month - 1, 1));
    endDate = new Date(Date.UTC(year, month, 1));
  } else if (year) {
    startDate = new Date(Date.UTC(year, 0, 1));
    endDate = new Date(Date.UTC(year + 1, 0, 1));
  } else if (month) {
    startDate = new Date(Date.UTC(new Date().getFullYear(), month - 1, 1));
    endDate = new Date(Date.UTC(new Date().getFullYear(), month, 1));
  }

  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = { createdAt: { $gte: startDate, $lt: endDate } };
  }

  const shops = await ShopModel.find({ userId });
  if (!shops) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shops not found');
  }

  const shopIds = await shops?.map(shop => shop._id);
  const queryBuilder = new QueryBuilder(
    OrderModel.find({
      shopId: shopId ? shopId : { $in: shopIds || [] },
      ...dateFilter,
      orderStatus: { $ne: 'canceled' },
    }),
    query
  );

  const orders = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['userId', 'shopId'], {
      userId: 'name orders',
      shopId: 'shopAddress revenue',
    })
    .modelQuery.lean()
    .exec();

  const pagination = await queryBuilder.getPaginationInfo();

  // Calculate business owner's earnings for each order
  const earning = orders.map(order => {
    const adminRevenue = (order.totalAmount * order.revenue) / 100;
    const businessEarning = order.totalAmount - adminRevenue;

    return {
      ...order,
      businessEarning: businessEarning,
    };
  });

  return { earning, pagination };
};
const getSpecificEarnings = async (id: string) => {
  const result = await OrderModel.findById(id).populate({
    path: 'products.productId',
    select: 'image',
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return result;
};
export const EarningService = { getEarnings, getSpecificEarnings };
