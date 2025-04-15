import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { StripeServices } from './stripe.service';
import config from '../../../../config';

const createConnectedAccount = catchAsync(async (req, res) => {
  const { email }: any = req.user;
  const result = await StripeServices.createAccount(email);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Connected Account created successfully',
    data: result,
  });
});
const createOnboardingLink = catchAsync(async (req, res) => {
  const { email }: any = req.user;
  const returnUrl = `${config.frontend_base_url}/shop-management`;
  const refreshUrl = `${config.frontend_base_url}/shop-management`;
  const onboardingLink = await StripeServices.createOnboardingLink(
    email,
    returnUrl,
    refreshUrl
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Onboarding link generated successfully',
    data: onboardingLink,
  });
});
const varifyStripeAccauntStatus = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const result = await StripeServices.checkVendorAccountStatus(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result
      ? 'Your stripe account is verified.'
      : 'Your stripe account is unverified.',
    data: result,
  });
});

export const StripeController = {
  createConnectedAccount,
  createOnboardingLink,
  varifyStripeAccauntStatus,
};
