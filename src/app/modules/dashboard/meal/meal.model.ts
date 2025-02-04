import mongoose, { Schema } from 'mongoose';
import { IMeal } from './meal.interface';

const MealSchema: Schema = new Schema<IMeal>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
    collectionTime: { type: String },
    dietaryPreference: {
      type: String,
    },
    description: { type: String, required: true },
    mealStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const MealModel = mongoose.model<IMeal>('Meal', MealSchema);

export default MealModel;
