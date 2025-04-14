import ShopModel from '../app/modules/businessDashboard/shop/shop.model';
import OrderModel from '../app/modules/orders/orders.model';

export async function updateShopsWithTopCategories(shopId: string) {
  try {
    const topCategories = await OrderModel.aggregate([
      {
        $match: {
          shopId: shopId,
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: '$products.category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    const topCategoryNames = topCategories.map(item => item._id);

    await ShopModel.findByIdAndUpdate(shopId, {
      $set: { categories: topCategoryNames },
    });

    console.log('Shop updated with top 3 categories');
  } catch (error) {
    console.error('Error updating shop with top categories:', error);
    throw error;
  }
}
