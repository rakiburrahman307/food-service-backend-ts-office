import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { TShop } from './shop.interface';
import ShopModel from './shop.model';
import { JwtPayload } from 'jsonwebtoken';
import unlinkFile from '../../../../shared/unlinkFile';
import QueryBuilder from '../../../builder/QueryBuilder';
import { getAdminId } from '../../../../util/getAdmin';
import { sendNotifications } from '../../../../helpers/sendNotification';

const createShop = async (user: JwtPayload, payload: Partial<TShop>) => {
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

  //@ts-ignore
  const socketIo = global.io;
  // Emitting a general 'shopCreated' event
  socketIo.emit(`shopCreated`);

  const adminId = await getAdminId();
  const notificationText = `A new shop has been created by user email ${
    user.email
  }. Shop name: ${payload.shopName || 'Unnamed'}. Please review the details.`;

  const notificationData = {
    receiver: adminId,
    text: notificationText,
    type: 'ALERT',
  };

  // Parallel processing: send notifications and other async tasks
  await Promise.all([sendNotifications(notificationData)]);

  return createShop;
};
const updateShopInfo = async (
  user: JwtPayload,
  id: string,
  payload: Partial<TShop>
) => {
  const isExistShop = await ShopModel.findById(id);
  if (!isExistShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  //unlink file here
  if (payload.logo) {
    unlinkFile(isExistShop?.logo);
  }
  if (payload.banner) {
    unlinkFile(isExistShop?.banner);
  }
  // Update the shop in the database
  const updatedShop = await ShopModel.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
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
  const deletedShop = await ShopModel.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
    $unset: { turnOffShop: '' },
  });
  if (!deletedShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  return deletedShop;
};
const getShop = async (id: string) => {
  const result = await ShopModel.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shop not found');
  }
  return result;
};
// get all the shops
const getAllShop = async (user: JwtPayload, query: Record<string, unknown>) => {
  if (!user?.id) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User ID is missing');
  }
  const queryBuilder = new QueryBuilder(
    ShopModel.find({ userId: user.id }),
    query
  );
  const shops = await queryBuilder
    .filter()
    // .paginate()
    .fields()
    .modelQuery.exec();
  const pagination = await queryBuilder.getPaginationInfo();
  return { shops, pagination };
};

export const ShopService = {
  createShop,
  deleteShop,
  updateShopInfo,
  toggleShopOffStatus,
  getShop,
  getAllShop,
};
