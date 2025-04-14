import mongoose from 'mongoose';
import { IProduct } from '../payment/payment.interface';

// Product type
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  orderNumber: string;
  products: IProduct[];
  paymentIntentId: string;
  subTotal: number;
  paymentMethod: string;
  revenue: number;
  totalAmount: number;
  currency: string;
  orderStatus:
    | 'pending'
    | 'preparing'
    | 'ready for pickup'
    | 'delivered'
    | 'canceled';
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready for pickup'
  | 'delivered'
  | 'canceled';
