import mongoose, { Document } from 'mongoose';

export interface IAlertNotificationSettings extends Document {
  userId: mongoose.Types.ObjectId;
  email: boolean;
  calendarReminders: boolean;
  pushNotifications: boolean;
}
