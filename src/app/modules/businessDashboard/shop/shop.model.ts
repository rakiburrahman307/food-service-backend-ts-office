import mongoose, { Schema } from 'mongoose';
import { TShop, TShopModal } from './shop.interface';
const shopLocationSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (coords: any) {
        // Ensure there are exactly two elements (longitude, latitude)
        if (coords.length !== 2) return false;

        // Validate the longitude (between -180 and 180)
        const [longitude, latitude] = coords;
        if (
          longitude < -180 ||
          longitude > 180 ||
          latitude < -90 ||
          latitude > 90
        ) {
          return false;
        }
        return true;
      },
      message:
        'Invalid coordinates: longitude must be between -180 and 180, latitude must be between -90 and 90.',
    },
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
      trim: true,
    },
    shopOwnerName: {
      type: String,
      required: [true, 'Shop owner name is required'],
      maxlength: 100,
      trim: true,
    },
    shopLicence: {
      type: String,
      required: [true, 'Shop licence is required'],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9-]+$/, 'Invalid shop licence format'],
    },
    shopAddress: {
      type: String,
      required: [true, 'Shop address is required'],
      default: '',
    },
    shopLocation: shopLocationSchema,
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
    minOrderOfferPrice: {
      type: Number,
      required: [true, 'Minimum order offer price is required'],
      min: [0, 'Minimum offer price cannot be negative'],
    },
    logo: {
      type: String,
      required: [true, 'Shop logo is required'],
      validate: {
        validator: (value: string) => /\.(jpg|jpeg|png|webp)$/i.test(value),
        message: 'Invalid image format. Allowed: jpg, jpeg, png, webp',
      },
    },
    banner: {
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
    categories: { type: [String], default: [] },
    avarageRating: { type: Number, default: 0 },
    revenue: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false },
    totalFeedback: { type: Number, default: 0 },
    isFavorit: { type: Boolean, default: false },
    turnOffShop: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  },
  { timestamps: true }
);
// Ensure the geospatial index is created

shopSchema.index({ shopLocation: '2dsphere' });
shopSchema.statics.isExistShopById = async (
  id: string | Schema.Types.ObjectId
) => {
  const isExist = await ShopModel.findById(id);
  return isExist;
};
// Query Middleware
shopSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

shopSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

shopSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
const ShopModel = mongoose.model<TShop, TShopModal>('Shop', shopSchema);
export default ShopModel;
