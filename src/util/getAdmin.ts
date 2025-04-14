import { User } from '../app/modules/user/user.model';
export const getAdminId = async () => {
  const admin = await User.findOne({ role: 'SUPER_ADMIN' });
  return admin ? admin._id : null;
};
