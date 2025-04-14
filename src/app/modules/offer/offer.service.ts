import QueryBuilder from '../../builder/QueryBuilder';
import MealModel from '../businessDashboard/meal/meal.model';

const getAvailableOfferItem = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    MealModel.find({ offerStatus: true }),
    query
  );
  const offerItems = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['shopId'], { shopId: 'shopName shopAddress' })
    .modelQuery.exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { offerItems, pagination };
};
const getShopOfferItem = async (shopId: string) => {
  const offerItems = await MealModel.find({ offerStatus: true, shopId });
  return offerItems;
};

export const OfferService = { getAvailableOfferItem, getShopOfferItem };
