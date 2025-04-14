import { Types } from 'mongoose';
import Stripe from 'stripe';

export interface IProduct {
  productId: Types.ObjectId;
  shopId: Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IPayment extends Document {
  userId: Types.ObjectId;
  products: IProduct[];
  paymentIntentId: string;
  paymentStatus: string;
  paymentMethod: string;
  orderNumber: string;
  subTotal: number;
  totalDiscount: number;
  totalAmount: number;
  revenue: number;
  currency: string;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPaymentData {
  name?: string;
  email?: string;
  amount: number;
  currency: string;
  paymentMethod?: Stripe.PaymentMethod;
  transactionId: string;
  orderNumber: string;
  date: string;
}
