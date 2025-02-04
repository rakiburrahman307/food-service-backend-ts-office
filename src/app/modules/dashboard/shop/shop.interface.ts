import mongoose, { Model } from 'mongoose';

// Shop Schema Interface
export interface TBankCard {
  cardNumber: string;
  cardHolderName: string;
  expireDate: string;
  cvv: string;
}
export interface TShop extends Document {
  userId: mongoose.Types.ObjectId;
  shopName: string;
  shopOwnerName: string;
  shopLicence: string;
  shopLocation: string;
  shopOpenTime: string;
  shopCloseTime: string;
  minOrderPrice: number;
  bankCard: TBankCard;
  minOrderOfferPrice: number;
  shopLogo: string;
  shopBanner: string;
  shopDescription: string;
  turnOffShop: boolean;
}

export type TShopModal = {
  isExistShopById(id: mongoose.Types.ObjectId): any;
} & Model<TShop>;
