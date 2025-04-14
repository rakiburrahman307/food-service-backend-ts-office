import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../errors/ApiError';
import ShopModel from '../modules/businessDashboard/shop/shop.model';
import { User } from '../modules/user/user.model';

export const authorizeShopOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: any = req.user?.id;
    const shopId = req.params.id;

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is not authenticated');
    }

    // Verify if the shop exists
    const shop = await ShopModel.findById(shopId);
    if (!shop) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Shop is not found');
    }

    // Verify if the user exists
    const userExists = await User.isExistUserById(userId);
    if (!userExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User is not found');
    }

    // Check if the authenticated user owns the shop
    if (shop.userId?.toString() !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to perform this action'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
