import { IAlertNotificationSettings } from './alert.interface';
import { NotificationSettingsModel } from './alert.model';

const getNotificationSettings = async (userId: string) => {
  let settings = await NotificationSettingsModel.findOne({ userId });
  if (!settings) {
    settings = await NotificationSettingsModel.create({ userId });
  }
  return settings;
};

const updateNotificationSettings = async (
  userId: string,
  settingsData: Partial<IAlertNotificationSettings>
) => {
  const result = await NotificationSettingsModel.findOneAndUpdate(
    { userId },
    settingsData,
    { new: true, upsert: true }
  );
  return result;
};
export const AlertSevices = {
  getNotificationSettings,
  updateNotificationSettings,
};
