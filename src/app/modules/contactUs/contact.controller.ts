import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { ConatctService } from './contact.service';

const getHelpMessage = catchAsync(async (req, res) => {
  const query = req.query;
  const getMessage = await ConatctService.getEmail(query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message retrieved successfully',
    data: getMessage,
  });
});
const getSingleHelpMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const getMessage = await ConatctService.getSingleEmail(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message retrieved successfully',
    data: getMessage,
  });
});
const createHelpMessage = catchAsync(async (req, res) => {
  const contactMessage = req.body;
  await ConatctService.sendEmailUser(contactMessage);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message send successfully',
  });
});

export const contactController = {
  createHelpMessage,
  getHelpMessage,
  getSingleHelpMessage,
};
