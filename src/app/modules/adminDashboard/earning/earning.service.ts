import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import QueryBuilder from '../../../builder/QueryBuilder';
import OrderModel from '../../orders/orders.model';

const getErningdetailsFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    OrderModel.find({ orderStatus: { $in: ['delivered', 'canceled'] } }),
    query
  );
  queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['userId', 'shopId'], {
      userId: 'name email location',
      shopId: 'shopName',
    });

  const earning = await queryBuilder.modelQuery.lean().exec();
  const pagination = await queryBuilder.getPaginationInfo();

  // Calculate admin revenue using the revenue field from OrderModel
  const earningsWithAdminRevenue = earning.map(order => {
    const revenuePercentage = order.revenue;
    return {
      ...order,
      adminRevenue: (order.totalAmount * revenuePercentage) / 100,
    };
  });

  return { earning: earningsWithAdminRevenue, pagination };
};
const getSingleErningdetailsFromDb = async (id: string) => {
  const result = await OrderModel.findById(id)
    .populate('userId', 'name email location')
    .populate('shopId', 'shopName shopAddress revenue')
    .populate('products.productId', 'image offerPrice');
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'This Earning details not found');
  }
  return result;
};
export const EarningService = {
  getErningdetailsFromDb,
  getSingleErningdetailsFromDb,
};
