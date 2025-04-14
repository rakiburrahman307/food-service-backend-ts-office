import mongoose, { Schema, Document } from 'mongoose';
import { IPayment, IProduct } from './payment.interface';

const productSchema = new Schema<IProduct>({
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'Meal' },
  shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [productSchema],
    paymentIntentId: { type: String, required: true },
    orderNumber: { type: String, default: '' },
    paymentStatus: { type: String, required: true },
    totalDiscount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    revenue: { type: Number, required: true},
    subTotal: { type: Number },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    orderStatus: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);

export default PaymentModel;
