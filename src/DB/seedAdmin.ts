import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';
import bcrypt from 'bcrypt';

const usersData = [
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

const hashPassword = async (password: string) => {
  const salt = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
  return await bcrypt.hash(password, salt);
};

const seedUsers = async () => {
  try {
    await User.deleteMany();
    const hashedUsersData = await Promise.all(
      usersData.map(async (user:any) => {
        const hashedPassword = await hashPassword(user.password);
        return { ...user, password: hashedPassword }; // Replace the password with the hashed one
      }),
    );
    await User.insertMany(hashedUsersData);

    console.log('Users seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};


// Connect to MongoDB
mongoose.connect(config.database_url as string);

 const seedSuperAdmin = async () => {
  try {
    console.log('--------------> Database seeding start <--------------');
    await seedUsers();
    console.log('--------------> Database seeding completed <--------------');
  } catch (error) {
    logger.error('Error creating Super Admin:', error);
  }finally {
    mongoose.disconnect();
  }
};

seedSuperAdmin()
