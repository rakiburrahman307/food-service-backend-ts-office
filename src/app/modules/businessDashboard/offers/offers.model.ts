import mongoose, { Schema } from 'mongoose';
import { TOfffer } from './offers.interface';

const offerSchema: Schema = new Schema<TOfffer>({
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  shopName: { type: String, required: true },
  itemName: { type: String, required: true },
  shopCategory: { type: String, required: true },
  image: { type: String },
  offerTitle: { type: String, required: true },
  discountPrice: { type: Number, required: true },
  stateDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['panding', 'active', 'completed', 'reject'],
    default: 'panding',
  },
});

const OfferModel = mongoose.model<TOfffer>('Offer', offerSchema);
export default OfferModel;
