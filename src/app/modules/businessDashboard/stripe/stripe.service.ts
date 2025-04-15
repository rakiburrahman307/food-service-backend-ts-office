import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { User } from '../../user/user.model';
import stripeService from '../../../builder/StripeService';

const createAccount = async (email: string) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.stripeAccountId) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email already has a Stripe account linked.'
      );
    }
  }
  const account = await stripeService.createConnectedAccount(email);
  if (!account) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error creating account');
  }
  await User.findByIdAndUpdate(existingUser?._id, {
    $set: {
      stripeAccountId: account.id,
    },
  });
  return account.id;
};
const createOnboardingLink = async (
  email: string,
  returnUrl: string,
  refreshUrl: string
) => {
  // Check for required parameters
  if (!email || !returnUrl || !refreshUrl) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Email, returnUrl, and refreshUrl are required'
    );
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  if (!existingUser.stripeAccountId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User does not have a connected Stripe account'
    );
  }
  const modifiedReturnUrl = `${returnUrl}?status=success&accountId=${existingUser.stripeAccountId}`;
  const link = await stripeService.createAccountLink(
    existingUser.stripeAccountId,
    modifiedReturnUrl,
    refreshUrl
  );
  return link;
};

const checkVendorAccountStatus = async (userId: string) => {
  // Fetch user data from the database
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Check if the user has a Stripe account associated
  if (!user.stripeAccountId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "You don't have a Stripe account");
  }

  // Check the Stripe account status (whether it's disabled or not)
  const disabledReason = await stripeService.checkStripeAccountStatus(user.stripeAccountId);

  // Update the user's account status in the database based on whether the Stripe account is disabled or not
  const newStatus = !disabledReason;  // true if not disabled, false if disabled
  await User.findByIdAndUpdate(userId, {
    $set: {
      stripeAccountStatus: newStatus,
    },
  });

  // Return the account status as a boolean
  return newStatus;  // true if the account is active, false if it's disabled
};


export const StripeServices = {
  createAccount,
  createOnboardingLink,
  checkVendorAccountStatus,
};
