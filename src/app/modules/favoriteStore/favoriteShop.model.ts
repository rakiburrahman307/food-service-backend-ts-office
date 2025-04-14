import mongoose, { Schema } from 'mongoose';
import { IFevoriteShop } from './favoriteShop.interface';

const favoriteShopSchema = new Schema<IFevoriteShop>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const FavoriteShopModel = mongoose.model<IFevoriteShop>(
  'FavoriteShop',
  favoriteShopSchema
);

export default FavoriteShopModel;
