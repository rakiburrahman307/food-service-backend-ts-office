import mongoose, { Document } from "mongoose";

export interface IMeal extends Document {
  shopId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  offerPrice?: number;
  category: string;
  image: string;
  collectionTime: string;
  dietaryPreference?: string;
  description: string;
  mealStatus: boolean;
}

