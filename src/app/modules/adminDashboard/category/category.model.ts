import mongoose, { Schema } from 'mongoose';
import { ICategroy } from './category.interface';

const categorySchema: Schema = new Schema<ICategroy>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    image: { type: String, required: true },
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model<ICategroy>('Category', categorySchema);

export default CategoryModel;
