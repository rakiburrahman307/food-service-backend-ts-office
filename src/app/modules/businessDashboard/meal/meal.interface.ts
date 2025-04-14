import mongoose, { Document, Model } from 'mongoose';

export interface IMeal {
  shopId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  offerPrice?: number;
  offerStatus: boolean;
  category: string;
  image: string;
  collectionTime: string;
  isFavorit: boolean;
  dietaryPreference?: string;
  description: string;
  mealStatus: boolean;
  isDeleted: boolean;
}

export type TMealModal = {
  isExistMealById(id: string | mongoose.Types.ObjectId): any;
} & Model<IMeal>;
