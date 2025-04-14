import mongoose, { Schema } from 'mongoose';
import { IAlertNotificationSettings } from './alert.interface';

const AlertSettingsSchema = new Schema<IAlertNotificationSettings>({
  userId: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  email: { type: Boolean, default: true },
  calendarReminders: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: true },
});

export const NotificationSettingsModel =
  mongoose.model<IAlertNotificationSettings>('Alert', AlertSettingsSchema);
