import mongoose, { Schema } from 'mongoose';
import { IMeal, TMealModal } from './meal.interface';

const mealSchema: Schema = new Schema<IMeal>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0 },
    offerStatus: { type: Boolean, default: false },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, default: '', trim: true },
    isFavorit: { type: Boolean, default: false },
    collectionTime: { type: String },
    dietaryPreference: {
      type: String,
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },
    description: { type: String, required: true },
    mealStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mealSchema.statics.isExistMealById = async (
  id: string | Schema.Types.ObjectId
) => {
  const isExist = await MealModel.findById(id);
  return isExist;
};
// Query Middleware
mealSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

mealSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

mealSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
const MealModel = mongoose.model<IMeal, TMealModal>('Meal', mealSchema);

export default MealModel;
