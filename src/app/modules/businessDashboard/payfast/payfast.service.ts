// import { StatusCodes } from 'http-status-codes';
// import ApiError from '../../../../errors/ApiError';
// import { User } from '../../user/user.model';
// import { PayFastService } from '../../../builder/PayFast';

// const createAccount = async (email: string, payFastMerchantId: string) => {
//   const existingUser = await User.findOne({ email });
//   if (!existingUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'This email not found!');
//   }
//   if (existingUser) {
//     if (existingUser.payFastMerchantId) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         'This email already has a PayFast account linked.'
//       );
//     }
//   }

//   if (!payFastMerchantId) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'You must provide a valid PayFast Merchant ID.'
//     );
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     existingUser._id,
//     {
//       $set: { payFastMerchantId: payFastMerchantId },
//     },
//     { new: true }
//   );

//   if (!updatedUser) {
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Error linking PayFast account'
//     );
//   }

//   return {
//     message: 'PayFast account linked successfully',
//     payFastMerchantId: updatedUser.payFastMerchantId,
//   };
// };

// // const createOnboardingLink = async (
// //   email: string,
// //   returnUrl: string,
// //   refreshUrl: string
// // ) => {
// //   // Check for required parameters
// //   if (!email || !returnUrl || !refreshUrl) {
// //     throw new ApiError(
// //       StatusCodes.BAD_REQUEST,
// //       'Email, returnUrl, and refreshUrl are required'
// //     );
// //   }
// //   const existingUser = await User.findOne({ email });
// //   if (!existingUser) {
// //     throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
// //   }

// //   if (!existingUser.stripeAccountId) {
// //     throw new ApiError(
// //       StatusCodes.BAD_REQUEST,
// //       'User does not have a connected Stripe account'
// //     );
// //   }
// //   const modifiedReturnUrl = `${returnUrl}?status=success&accountId=${existingUser.stripeAccountId}`;
// //   const link = await stripeService.createAccountLink(
// //     existingUser.stripeAccountId,
// //     modifiedReturnUrl,
// //     refreshUrl
// //   );
// //   return link;
// // };

// const checkVendorAccountStatus = async (userId: string) => {
//   // Fetch user data from the database
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   // Check if the user has a PayFast account linked
//   if (!user.payFastMerchantId) {
//     throw new ApiError(
//       StatusCodes.NOT_FOUND,
//       "You don't have a PayFast account"
//     );
//   }

//   // You can check the payment status through PayFast's transaction API, but account status isn't available directly like Stripe
//   const paymentStatus = await PayFastService.checkTransactionStatus(
//     user.payFastMerchantId
//   );

//   // If the status is confirmed, it means the account is active and capable of receiving payments
//   const newStatus = paymentStatus === 'completed'; // Assuming 'completed' means the account is ready

//   await User.findByIdAndUpdate(userId, {
//     $set: {
//       payFastAccountStatus: newStatus,
//     },
//   });

//   return newStatus; // true if the account is active, false otherwise
// };

// export const PayFastPaymentService = {
//   createAccount,
//   // createOnboardingLink,
//   checkVendorAccountStatus,
// };
