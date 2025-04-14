import { Document, Types } from 'mongoose';

export interface IFevoriteItem extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  status: boolean;
}
