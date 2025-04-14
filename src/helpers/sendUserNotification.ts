import { StatusCodes } from 'http-status-codes';
import { NotificationSettingsModel } from '../app/modules/alert/alert.model';
import { User } from '../app/modules/user/user.model';
import ApiError from '../errors/ApiError';
import { emailHelper } from './emailHelper';
import { sendNotifications } from './sendNotification';
import { emailTemplate } from '../shared/emailTemplate';

export const sendUserNotification = async (userId: string, message: any) => {
  try {
    const [alertSettings, user] = await Promise.all([
      NotificationSettingsModel.findOne({ userId }),
      User.findById(userId),
    ]);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'This user does not exist');
    }
    message.name = user.name;

    const tamplate = await emailTemplate.paymentConfirmationTemplate(message);
    const sendEmail = alertSettings?.email
      ? emailHelper.sendEmail({
          to: user.email,
          subject: tamplate.subject,
          html: tamplate.html,
        })
      : Promise.resolve();
      
    const notification = {
      text: `Your payment of ${
        message.amount
      } ${message.currency.toUpperCase()} was successful`,
      receiver: userId,
      referenceId: message.transactionId || null,
      type: 'PAYMENT',
      read: false,
    };
    const sendPushNotification = alertSettings?.pushNotifications
      ? sendNotifications(notification)
      : Promise.resolve(); // No push notification sent if disabled

    // Wait for email and push notification to be completed
    await Promise.all([sendEmail, sendPushNotification]);

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to send notification'
    );
  }
};
