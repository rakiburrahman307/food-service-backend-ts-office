import mongoose, { Schema } from 'mongoose';
import { IOrder } from './orders.interface';
import { IProduct } from '../payment/payment.interface';
const productSchema = new Schema<IProduct>({
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'Meal' },
  shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    orderNumber: { type: String, default: '' },
    products: [productSchema],
    subTotal: { type: Number },
    paymentIntentId: { type: String, required: true },
    paymentMethod: { type: String },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    revenue: { type: Number, required: true},
    orderStatus: {
      type: String,
      enum: ['pending', 'preparing', 'ready for pickup', 'delivered', "canceled"],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;
