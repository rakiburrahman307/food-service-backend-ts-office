import mongoose, { ObjectId, Schema } from 'mongoose';
import { TBankCard, TShop, TShopModal } from './shop.interface';

const BankCardSchema = new Schema<TBankCard>({
  cardNumber: {
    type: String,
    required: [true, 'Card number is required'],
    match: [/^\d{16}$/, 'Card number must be 16 digits'],
  },
  cardHolderName: {
    type: String,
    required: [true, 'Card holder name is required'],
  },
  expireDate: {
    type: String,
    required: [true, 'Expiry date is required'],
    match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expire date must be in MM/YY format'],
  },
  cvv: {
    type: String,
    required: [true, 'CVV is required'],
    match: [/^\d{3,4}$/, 'CVV must be 3 or 4 digits'],
  },
});

const shopSchema: Schema<TShop> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      maxlength: 100,
    },
    shopOwnerName: {
      type: String,
      required: [true, 'Shop owner name is required'],
      maxlength: 100,
    },
    shopLicence: {
      type: String,
      required: [true, 'Shop licence is required'],
      unique: true,
      match: [/^[A-Za-z0-9-]+$/, 'Invalid shop licence format'],
    },
    shopLocation: {
      type: String,
      required: [true, 'Shop location is required'],
      maxlength: 255,
    },
    shopOpenTime: {
      type: String,
      required: [true, 'Shop opening time is required'],
      match: [
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:mm)',
      ],
    },
    shopCloseTime: {
      type: String,
      required: [true, 'Shop closing time is required'],
      match: [
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:mm)',
      ],
    },
    minOrderPrice: {
      type: Number,
      required: [true, 'Minimum order price is required'],
      min: [0, 'Minimum order price cannot be negative'],
    },
    bankCard: {
      type: BankCardSchema,
      required: [true, 'Bank card details are required'],
    },
    minOrderOfferPrice: {
      type: Number,
      required: [true, 'Minimum order offer price is required'],
      min: [0, 'Minimum offer price cannot be negative'],
    },
    shopLogo: {
      type: String,
      required: [true, 'Shop logo is required'],
      validate: {
        validator: (value: string) => /\.(jpg|jpeg|png|webp)$/i.test(value),
        message: 'Invalid image format. Allowed: jpg, jpeg, png, webp',
      },
    },
    shopBanner: {
      type: String,
      required: [true, 'Shop banner is required'],
      validate: {
        validator: (value: string) => /\.(jpg|jpeg|png|webp)$/i.test(value),
        message: 'Invalid image format. Allowed: jpg, jpeg, png, webp',
      },
    },
    shopDescription: {
      type: String,
      required: [true, 'Shop description is required'],
      maxlength: 500,
    },
    turnOffShop: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shopSchema.statics.isExistShopById = async (id: Schema.Types.ObjectId) => {
  const isExist = await ShopModel.findById(id);
  return isExist;
};

const ShopModel = mongoose.model<TShop, TShopModal>('Shops', shopSchema);
export default ShopModel;
