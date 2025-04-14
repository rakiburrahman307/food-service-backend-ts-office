import mongoose from 'mongoose';

export type TOfffer = {
  _id: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  shopName: string;
  itemName: string;
  shopCategory: string;
  image?: string;
  offerTitle: string;
  discountPrice: number;
  stateDate: string;
  endDate: string;
  status: 'panding' | 'running' | 'completed' | 'reject';
  description: string;
};
