import mongoose, { Schema } from 'mongoose';
import { IFevoriteItem } from './favoriteItem.interface';

const favoriteItemSchema = new Schema<IFevoriteItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
    status: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const FavoriteItemModel = mongoose.model<IFevoriteItem>(
  'FavoriteItem',
  favoriteItemSchema
);

export default FavoriteItemModel;
