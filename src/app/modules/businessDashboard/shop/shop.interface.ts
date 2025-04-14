import mongoose, { Model } from 'mongoose';
import { ILocation } from '../../user/user.interface';


export interface TShop extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  shopName: string;
  shopOwnerName: string;
  shopLicence: string;
  shopAddress: string;
  shopLocation: ILocation;
  shopOpenTime: string;
  shopCloseTime: string;
  minOrderPrice: number;
  avarageRating: number;
  totalFeedback: number;
  isFavorit: boolean;
  minOrderOfferPrice: number;
  revenue: number;
  logo: string;
  banner: string;
  categories: string[];
  distance: string;
  shopDescription: string;
  turnOffShop: boolean;
  isDeleted: boolean;
  status: 'active' | 'blocked';
}

export type TShopModal = {
  isExistShopById(id: string | mongoose.Types.ObjectId): any;
} & Model<TShop>;
