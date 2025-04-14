import { Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  shopId: Types.ObjectId;
  ratings: number;
  comments: string;
}



export interface IFeedbackPropes {
  userId: string;  
  shopId: string;  
  ratings: number;          
  comments: string;      
}