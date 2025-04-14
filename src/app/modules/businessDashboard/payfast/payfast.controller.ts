import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { PayFastPaymentService } from './payfast.service';

const createConnectedAccount = catchAsync(async (req, res) => {
  const { email }: any = req.user;
  const { payFastMerchantId } = req.body;
  const result = await PayFastPaymentService.createAccount(
    email,
    payFastMerchantId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Connected Merchant Account created successfully',
    data: result,
  });
});
// const createOnboardingLink = catchAsync(async (req, res) => {
//   const { email }: any = req.user;
//   const returnUrl = `${config.frontend_base_url}/shop-management`;
//   const refreshUrl = `${config.frontend_base_url}/shop-management`;
//   const onboardingLink = await PayFastPaymentService.createOnboardingLink(
//     email,
//     returnUrl,
//     refreshUrl
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Onboarding link generated successfully',
//     data: onboardingLink,
//   });
// });
const varifyPayfastAccauntStatus = catchAsync(async (req, res) => {
  const { id }: any = req.user;
  const result = await PayFastPaymentService.checkVendorAccountStatus(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result
      ? 'Your Payfast account is verified.'
      : 'Your Payfast account is unverified.',
    data: result,
  });
});

export const PayfastController = {
  createConnectedAccount,
  // createOnboardingLink,
  varifyPayfastAccauntStatus,
};
