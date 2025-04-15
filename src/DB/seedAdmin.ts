import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';

const payload = [
  {
    name: 'Administrator',
    email: config.super_admin.email,
    role: USER_ROLES.SUPER_ADMIN,
    password: config.super_admin.password,  // No need to hash here
    verified: true,
  },
  {
    name: 'Faheemmoolla',
    email: 'faheemmoolla1@gmail.com',
    role: USER_ROLES.USER,
    password: 'hello123',  // Plain text password
    phoneCountry: 'SA',
    phoneCountryCode: '+27',
    phone: '812342343',
    verified: true,
  },
  {
    name: 'User',
    email: 'user@gmail.com',
    role: USER_ROLES.USER,
    password: 'hello123',  // Plain text password
    phoneCountry: 'SA',
    phoneCountryCode: '+27',
    phone: '812342343',
    verified: true,
  },
];

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await User.findOne({
      email: config.super_admin.email,
      role: USER_ROLES.SUPER_ADMIN,
    });

    if (!isExistSuperAdmin) {
      // Since password hashing is handled in the pre-save middleware, no need to manually hash passwords here
      await User.create(payload);  // Create users without manually hashing passwords

      logger.info('✨ Super Admin account has been successfully created!');
    }
  } catch (error) {
    logger.error('Error creating Super Admin:', error);
  }
};
