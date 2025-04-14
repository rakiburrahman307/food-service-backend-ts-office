import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import QueryBuilder from '../../../builder/QueryBuilder';
import { User } from '../../user/user.model';

const getUsersFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: 'USER' }), query);

  // Build the query using chainable methods
  queryBuilder
    .search(['name', 'email', 'phone'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await queryBuilder.modelQuery.exec();
  const paginationInfo = await queryBuilder.getPaginationInfo();

  return {
    users,
    pagination: paginationInfo,
  };
};

const updateUserStatus = async (id: string, payload: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { status: payload },
    { new: true }
  );
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

export const UserManagementService = { getUsersFromDb, updateUserStatus };
