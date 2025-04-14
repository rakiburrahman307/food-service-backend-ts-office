import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AlertSevices } from './alert.service';

const getUserNotifications = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const settings = await AlertSevices.getNotificationSettings(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User notifications retrieved successfully',
    data: settings,
  });
});

const updateUserNotifications = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const result = await AlertSevices.updateNotificationSettings(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User notifications updated successfully',
    data: result
  });
});

export const AlertControllers = {
  getUserNotifications,
  updateUserNotifications,
};
