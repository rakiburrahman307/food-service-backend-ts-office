import { Document } from 'mongoose';

export interface ICategroy extends Document {
  name: string;
  status: 'active' | 'inactive';
  image: string;
}
