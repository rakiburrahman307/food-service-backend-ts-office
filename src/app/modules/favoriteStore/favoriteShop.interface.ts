import { Document, Types } from 'mongoose';

export interface IFevoriteShop extends Document {
  userId: Types.ObjectId;
  shopId: Types.ObjectId;
  status: boolean;
}
