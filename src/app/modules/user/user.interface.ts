import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [ longitude, latitude ]
}
export interface IGlobalSearch extends Document {
  recentSearches: string[];
}
export type IUser = {
  id: string;
  name: string;
  role: USER_ROLES;
  email: string;
  phone: string;
  password: string;
  location: ILocation;
  image?: string;
  isDeleted: boolean;
  orders: boolean;
  address: string;
  recentSearches: [string];
  phoneCountry: string;
  phoneCountryCode: string;
  payFastMerchantId: string;
  payFastAccountStatus: boolean;
  status: 'active' | 'blocked';
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModel = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
