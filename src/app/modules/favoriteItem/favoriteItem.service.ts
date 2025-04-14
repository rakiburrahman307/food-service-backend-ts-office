import QueryBuilder from '../../builder/QueryBuilder';
import MealModel from '../businessDashboard/meal/meal.model';
import FavoriteItemModel from './favoriteItem.model';

const addFevItem = async (userId: string, productId: string) => {
  const existingFavorite = await FavoriteItemModel.findOne({
    userId,
    productId,
  });

  if (existingFavorite) {
    await FavoriteItemModel.deleteOne({ userId, productId });
    await MealModel.updateOne(
      { _id: productId },
      { $set: { isFavorit: false } },
      { new: true, runValidators: true }
    );
    return true;
  } else {
    const newFavoriteItem = new FavoriteItemModel({
      userId,
      productId,
    });
    await newFavoriteItem.save();
    await MealModel.updateOne(
      { _id: productId },
      { $set: { isFavorit: true } },
      { new: true, runValidators: true }
    );

    return newFavoriteItem;
  }
};

const getFevItemsFromDb = async (
  userId: string,
  params: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(
    FavoriteItemModel.find({ userId }),
    params
  );
  const favoriteItems = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()


    .modelQuery.populate({
      path: 'productId', 
      select: '_id name price offerPrice image category',
      populate: { 
        path: 'shopId', 
        select: 'shopAddress shopName'
      }
    }).exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { favoriteItems, pagination };
};

export const FavoriteItemService = { addFevItem, getFevItemsFromDb };
