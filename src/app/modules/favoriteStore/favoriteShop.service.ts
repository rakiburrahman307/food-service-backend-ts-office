import FavoriteShopModel from './favoriteShop.model';
import QueryBuilder from '../../builder/QueryBuilder';
import ShopModel from '../businessDashboard/shop/shop.model';

const addToFevShop = async (userId: string, shopId: string) => {
  const existingFavorite = await FavoriteShopModel.findOne({ userId, shopId });

  if (existingFavorite) {
    await FavoriteShopModel.deleteOne({ userId, shopId });
    await ShopModel.updateOne(
      { _id: shopId },
      { $set: { isFavorit: false } },
      { new: true, runValidators: true }
    );
    return false;
  } else {
    const newFavorite = new FavoriteShopModel({ userId, shopId, status: true });
    await newFavorite.save();

    await ShopModel.updateOne(
      { _id: shopId },
      { $set: { isFavorit: true } },
      { new: true, runValidators: true }
    );

    return newFavorite;
  }
};

const getFevShopFromDb = async (
  userId: string,
  params: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(
    FavoriteShopModel.find({ userId }),
    params
  );
  const favoriteShops = await queryBuilder
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(['shopId'], {})
    .modelQuery.exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { favoriteShops, pagination };
};
export const FavoriteShopService = { addToFevShop, getFevShopFromDb };
