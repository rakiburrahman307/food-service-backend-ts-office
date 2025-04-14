import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import MealModel from '../businessDashboard/meal/meal.model';
import ShopModel from '../businessDashboard/shop/shop.model';
import CategoryModel from '../adminDashboard/category/category.model';
import { User } from '../user/user.model';
import { Types } from 'mongoose';

type SortDirection = 1 | -1;

interface SortField {
  [key: string]: SortDirection;
}

interface ProjectionField {
  [key: string]: 1 | 0;
}
// get all the products
const getProducts = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    MealModel.find({ mealStatus: false }),
    query
  );
  const products = await queryBuilder
    .search(['name', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  const pagination = await queryBuilder.getPaginationInfo();

  return { products, pagination };
};

const getShops = async (
  userId: string | undefined,
  query: Record<string, unknown>
) => {
  // Get user coordinates
  let userLongitude = parseFloat(query.longitude as string);
  let userLatitude = parseFloat(query.latitude as string);

  if (isNaN(userLongitude) || isNaN(userLatitude)) {
    const user = await User.findById(userId).select('location');
    if (user?.location?.coordinates?.length === 2) {
      [userLongitude, userLatitude] = user.location.coordinates;
    } else {
      userLongitude = 0;
      userLatitude = 0;
    }
  }
  const blockedShop = await ShopModel.find({ status: 'blocked' }).select('_id');
  const blockedShopsIds = blockedShop.map(shop => shop._id);
  const maxDistance = query.maxDistance
    ? parseFloat(query.maxDistance as string) * 1000
    : 15000;

  const db = ShopModel.collection;
  const pipeline: any[] = [];

  pipeline.push({
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [userLongitude, userLatitude],
      },
      distanceField: 'distance',
      spherical: true,
      maxDistance: maxDistance,
      query: {
        turnOffShop: false,
        _id: { $nin: blockedShopsIds },
      },
    },
  });

  // Prepare additional match conditions
  const additionalMatches: Record<string, any> = {};

  // Process dietary preferences filter
  if (query.dietaryPreferences) {
    let dietaryPreferences = query.dietaryPreferences;
    if (typeof dietaryPreferences === 'string') {
      dietaryPreferences = [dietaryPreferences];
    }

    if (Array.isArray(dietaryPreferences)) {
      const regexArray = dietaryPreferences.map(
        preference => new RegExp(String(preference), 'i')
      );

      // Find meals with matching preferences
      const meals = await MealModel.find({
        isDeleted: false,
        dietaryPreference: { $in: regexArray },
      }).select('shopId');

      const shopIds = meals.map(meal => meal.shopId.toString());

      if (shopIds.length > 0) {
        // Add shopIds as a filter
        additionalMatches._id = {
          $in: shopIds.map(id => new Types.ObjectId(id)),
        };
      }
    }
  }

  // Process collection time filter
  if (query.collectionTime) {
    const meals = await MealModel.find({
      isDeleted: false,
      collectionTime: query.collectionTime as string,
    }).select('shopId');

    if (meals.length > 0) {
      const shopIds = meals.map(meal => meal.shopId.toString());

      // If we already have _id filter, we need to find the intersection
      if (additionalMatches._id) {
        const existingIds = new Set(
          additionalMatches._id.$in.map((id: Types.ObjectId) => id.toString())
        );
        const filteredIds = shopIds.filter(id => existingIds.has(id));
        additionalMatches._id.$in = filteredIds.map(
          id => new Types.ObjectId(id)
        );
      } else {
        additionalMatches._id = {
          $in: shopIds.map(id => new Types.ObjectId(id)),
        };
      }
    }
  }

  // Process category filter
  if (
    query.category &&
    typeof query.category === 'string' &&
    query.category.trim() !== ''
  ) {
    const category = query.category.trim();
    const categoryRegex = new RegExp(category, 'i');

    const meals = await MealModel.find({
      isDeleted: false,
      category: categoryRegex,
    }).select('shopId');

    if (meals.length > 0) {
      const shopIds = meals.map(meal => meal.shopId.toString());
      if (additionalMatches._id) {
        const existingIds = new Set(
          additionalMatches._id.$in.map((id: Types.ObjectId) => id.toString())
        );
        const filteredIds = shopIds.filter(id => existingIds.has(id));
        additionalMatches._id.$in = filteredIds.map(
          id => new Types.ObjectId(id)
        );
      } else {
        additionalMatches._id = {
          $in: shopIds.map(id => new Types.ObjectId(id)),
        };
      }
    }
  }

  // Process search term
  if (query.searchTerm) {
    additionalMatches.$or = [
      { shopName: { $regex: query.searchTerm, $options: 'i' } },
      { shopAddress: { $regex: query.searchTerm, $options: 'i' } },
      { categories: { $in: [query.searchTerm] } },
    ];
  }

  // Add all additional match conditions as a single $match stage
  if (Object.keys(additionalMatches).length > 0) {
    pipeline.push({ $match: additionalMatches });
  }

  // Add sort stage
  const sortField: SortField = {};

  if (query.sort) {
    const sortValue = query.sort as string;

    if (sortValue === 'ascending') {
      sortField.shopName = 1;
    } else if (sortValue === 'descending') {
      sortField.shopName = -1;
    } else if (sortValue === 'rating') {
      sortField.avarageRating = -1;
    } else {
      sortField.distance = 1;
    }
  } else {
    sortField.distance = 1;
  }

  pipeline.push({ $sort: sortField });

  // Fields projection
  if (query.fields && typeof query.fields === 'string') {
    const projectionFields: ProjectionField = {};

    query.fields.split(',').forEach((field: string) => {
      projectionFields[field.trim()] = 1;
    });

    pipeline.push({ $project: projectionFields });
  }

  // Count total documents before pagination
  const countPipeline = [...pipeline];
  countPipeline.push({ $count: 'total' });
  const countResult = await db.aggregate(countPipeline).toArray();
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination stages
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Execute aggregation with direct collection access
  const shops = await db.aggregate(pipeline).toArray();

  // Transform results
  const formattedShops = shops.map(shop => ({
    ...shop,
    longitude: shop?.shopLocation?.coordinates?.[0],
    latitude: shop?.shopLocation?.coordinates?.[1],
    distance: shop.distance ? (shop.distance / 1000).toFixed(2) : null,
  }));

  const pagination = {
    total,
    limit,
    page,
    totalPage: Math.ceil(total / limit),
  };

  return { shops: formattedShops, pagination };
};

// get specific shop
const getSpecificShops = async (id: string) => {
  const result = await ShopModel.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }

  return result;
};
const getSpecificShopsItems = async (
  id: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(MealModel.find({ shopId: id }), query);
  const products = await queryBuilder
    .search(['name', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  const pagination = await queryBuilder.getPaginationInfo();

  return { products, pagination };
};
// get item
const getItemfromDb = async (id: string) => {
  const result = await MealModel.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
  }

  return result;
};

// nearby shop
// const nearByShop = async (
//   longitude: string | undefined,
//   latitude: string | undefined,
//   maxDistance: string | undefined
// ) => {
//   if (!longitude || !latitude) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Longitude and latitude must be specified'
//     );
//   }

//   const userLocation: [number, number] = [
//     parseFloat(longitude),
//     parseFloat(latitude),
//   ];

//   if (isNaN(userLocation[0]) || isNaN(userLocation[1])) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Invalid latitude or longitude'
//     );
//   }

//   const maxDistanceInMeters = maxDistance
//     ? parseFloat(maxDistance) * 1000
//     : 10000;

//   const shops = await ShopModel.aggregate([
//     {
//       $geoNear: {
//         near: { type: 'Point', coordinates: userLocation },
//         distanceField: 'distance',
//         spherical: true,
//         maxDistance: maxDistanceInMeters,
//       },
//     },
//   ]);
//   return shops.map(shop => ({
//     ...shop,
//     distanceInKm: (shop.distance / 1000).toFixed(2), // Convert meters to km
//   }));
// };
const getCategorys = async () => {
  const categories = await CategoryModel.find({ status: 'active' });
  if (!categories) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No active categories found');
  }
  return categories;
};
export const HomeService = {
  getProducts,
  getShops,
  getSpecificShops,
  getSpecificShopsItems,
  getItemfromDb,
  getCategorys,
};
