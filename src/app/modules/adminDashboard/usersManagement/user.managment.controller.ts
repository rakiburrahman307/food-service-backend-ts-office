import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { UserManagementService } from './user.managment.service';

// get all the user
const getUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserManagementService.getUsersFromDb(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users data retrieved successfully',
    data: result.users,
    pagination: result.pagination,
  });
});

// update user status
const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status);
  const result = await UserManagementService.updateUserStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User status updated',
    data: result,
  });
});
export const UserManagementController = { getUsers, updateUserStatus };
