import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import {  TShop } from './shop.interface';
import ShopModel from './shop.model';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../user/user.model';
import { TFile } from '../../../../types/files';

const createShop = async (
  user: JwtPayload,
  files: TFile[],
  payload: Partial<TShop>
) => {
  // Process files and update payload
  if (files && files.length > 0) {
    files.forEach(file => {
      if (file.fieldname === 'shopLogo') {
        payload.shopLogo = file.path;
      }
      if (file.fieldname === 'shopBanner') {
        payload.shopBanner = file.path;
      }
    });
  }
  const shopData = {
    userId: user.id,
    ...payload,
  };
  const createShop = await ShopModel.create(shopData);
  if (!createShop) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create shop'
    );
  }
  return createShop;
};
const updateShopInfo = async (
  user: JwtPayload,
  id: string,
  files: TFile[],
  payload: Partial<TShop>
) => {
  // Process files and update payload
  if (files && files.length > 0) {
    files.forEach(file => {
      if (file.fieldname === 'shopLogo') {
        payload.shopLogo = file.path;
      }
      if (file.fieldname === 'shopBanner') {
        payload.shopBanner = file.path;
      }
    });
  }

  // Update the shop in the database
  const updatedShop = await ShopModel.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true }
  );

  if (!updatedShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }

  return updatedShop;
};

const toggleShopOffStatus = async (id: string) => {
  // Fetch the shop document to retrieve the current status
  const shop = await ShopModel.findById(id);

  if (!shop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }

  // Toggle the turnOffShop status
  const updatedShopOffStatus = await ShopModel.findByIdAndUpdate(
    id,
    { $set: { turnOffShop: !shop.turnOffShop } },
    { new: true }
  );

  return updatedShopOffStatus;
};

const deleteShop = async (id: string) => {
  // Delete the shop from the database
  const deletedShop = await ShopModel.findByIdAndDelete(id);
  if (!deletedShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  return deletedShop;
};
export const ShopService = {
  createShop,
  deleteShop,
  updateShopInfo,
  toggleShopOffStatus,
};
