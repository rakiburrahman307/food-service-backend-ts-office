import { FilterQuery, Query } from 'mongoose';
import ShopModel from '../modules/businessDashboard/shop/shop.model';
import MealModel from '../modules/businessDashboard/meal/meal.model';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //searching
  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      const searchConditions: FilterQuery<any>[] = searchableFields.map(
        field => ({
          [field]: {
            $regex: this.query.searchTerm,
            $options: 'i',
          },
        })
      );
      if (searchableFields.includes('categories')) {
        searchConditions.push({
          categories: {
            $in: [this.query.searchTerm],
          },
        });
      }

      this.modelQuery = this.modelQuery.find({
        $or: searchConditions,
      } as FilterQuery<any>);
    }
    return this;
  }
  // Location-based filtering
  async filterByLocation() {
    if (this.query.longitude && this.query.latitude) {
      const userLocation: [number, number] = [
        parseFloat(this.query.longitude as string),
        parseFloat(this.query.latitude as string),
      ];

      if (!isNaN(userLocation[0]) && !isNaN(userLocation[1])) {
        const maxDistance = this.query.maxDistance
          ? parseFloat(this.query.maxDistance as string) * 1000
          : 10000; // Default 10km

        const shopIds = await ShopModel.aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: userLocation },
              distanceField: 'distance',
              spherical: true,
              maxDistance: maxDistance,
            },
          },
          { $sort: { distance: 1 } },
          { $project: { _id: 1 } },
        ]);

        const ids = shopIds.map(shop => shop._id);
        this.modelQuery = ShopModel.find({ _id: { $in: ids } })
          .sort({ distance: 1 })
          .lean() as unknown as Query<T[], T>;
      }
    }
    return this;
  }

  //filtering
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      'searchTerm',
      'sort',
      'page',
      'limit',
      'fields',
      'longitude',
      'latitude',
      'maxDistance',
    ];
    excludeFields.forEach(el => delete queryObj[el]);
    Object.keys(queryObj).forEach(key => {
      if (typeof queryObj[key] === 'object' && queryObj[key] !== null) {
        queryObj[key] = { ...queryObj[key] };
      }
    });
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    if (this.query.sort) {
      let sortFields = (this.query.sort as string).split(',');
      const sortMapping: Record<string, string> = {
        ascending: 'shopName',
        descending: '-shopName',
        rating: '-avarageRating',
      };
      const mappedSortFields = sortFields
        .map(field => {
          return sortMapping[field] || field;
        })
        .join(' ');

      this.modelQuery = this.modelQuery.sort(mappedSortFields);
    }
    return this;
  }
  // Filter by dietary preferences (Meals -> Shops)
  async filterByDietaryPreferences() {
    if (this.query.dietaryPreferences) {
      let dietaryPreferences = this.query.dietaryPreferences;

      // Ensure the dietaryPreferences is a valid array of strings
      if (typeof dietaryPreferences === 'string') {
        dietaryPreferences = [dietaryPreferences]; // Convert it into an array if it's a single string
      }

      // Validate that dietaryPreferences is an array and contains valid strings
      if (
        Array.isArray(dietaryPreferences) &&
        dietaryPreferences.every(pref => typeof pref === 'string')
      ) {
        // Create a case-insensitive regex for each preference in the array
        const regexArray = dietaryPreferences.map(
          preference => new RegExp(preference, 'i')
        );

        // Fetch meals matching any of the case-insensitive dietary preferences
        const meals = await MealModel.find({
          dietaryPreference: { $in: regexArray },
        }).select('shopId');

        // Extract shopIds from the meals
        const shopIds = meals.map(meal => meal.shopId);

        // Apply the shop filter in the main query
        this.modelQuery = this.modelQuery.find({ _id: { $in: shopIds } });
      } else {
        console.log(
          'Invalid dietaryPreferences format, expected an array of strings'
        );
      }
    }
    return this;
  }

  async filterByCategory() {
    if (
      this.query.category &&
      typeof this.query.category === 'string' &&
      this.query.category.trim() !== ''
    ) {
      const category = this.query.category.trim();

      const categoryRegex = new RegExp(category, 'i');
      const meals = await MealModel.find({ category: categoryRegex }).select(
        'shopId'
      );

      // If no meals are found, do not apply the filter and log the message
      if (meals.length === 0) {
        console.log('No meals found with category:', category);
      } else {
        // If meals are found, update the model query to filter by shopIds
        const shopIds = meals.map(meal => meal.shopId);
        this.modelQuery = this.modelQuery.find({ _id: { $in: shopIds } });
      }
    }
    return this;
  }

  // // Filter by collection time (Meals -> Shops)
  async filterByCollectionTime() {
    if (this.query.collectionTime) {
      const meals = await MealModel.find({
        collectionTime: this.query.collectionTime as string,
      }).select('shopId');
      const shopIds = meals.map(meal => meal.shopId);
      this.modelQuery = this.modelQuery.find({ _id: { $in: shopIds } });
    }
    return this;
  }
  //pagination
  paginate() {
    let limit = Number(this?.query?.limit) || 10;
    let page = Number(this?.query?.page) || 1;
    let skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //fields filtering
  fields() {
    let fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  //populating
  populate(populateFields: string[], selectFields: Record<string, unknown>) {
    this.modelQuery = this.modelQuery.populate(
      populateFields.map(field => ({
        path: field,
        select: selectFields[field],
      }))
    );
    return this;
  }

  //pagination information
  async getPaginationInfo() {
    const total = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter()
    );
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const totalPage = Math.ceil(total / limit);

    return {
      total,
      limit,
      page,
      totalPage,
    };
  }
}

export default QueryBuilder;
