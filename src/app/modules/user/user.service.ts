import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { GlobalSearchModel, User } from './user.model';
// create user
const createUserToDB = async (payload: IUser): Promise<IUser> => {
  //set role
  const user = await User.isExistUserByEmail(payload.email);
  if (user) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
  }
  payload.role = USER_ROLES.USER;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP(6);
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

// create Businessman
const createBusinessmanToDB = async (payload: IUser): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.BUSINESSMAN;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP(6);
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};
// create Admin
// const createAdminToDB = async (
//   payload: Partial<IUser>
// ): Promise<IUser> => {
//   //set role
//   payload.role = USER_ROLES.ADMIN;
//   const createAdmin = await User.create(payload);
//   if (!createAdmin) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
//   }

//   //send email
//   const otp = generateOTP(6);
//   const values = {
//     name: createAdmin.name,
//     otp: otp,
//     email: createAdmin.email!,
//   };
//   const createAccountTemplate = emailTemplate.createAccount(values);
//   emailHelper.sendEmail(createAccountTemplate);

//   //save to DB
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };
//   await User.findOneAndUpdate(
//     { _id: createAdmin._id },
//     { $set: { authentication } }
//   );

//   return createAdmin;
// };

// get user profile
const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

// update user profile
const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }
  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updateDoc;
};

const verifyUserPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.');
  }
  const isPasswordValid = await User.isMatchPassword(password, user.password);
  return isPasswordValid;
};
const deleteUser = async (id: string) => {
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  await User.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });

  return true;
};

const addRecentSearch = async (searchTerm: string) => {
  try {
    const globalSearch = await GlobalSearchModel.findOne();
    if (!globalSearch) {
      const newSearch = new GlobalSearchModel({
        recentSearches: [searchTerm],
      });
      await newSearch.save();
      return true;
    }
    const existingIndex = globalSearch.recentSearches.indexOf(searchTerm);
    if (existingIndex !== -1) {
      globalSearch.recentSearches.splice(existingIndex, 1);
    }
    globalSearch.recentSearches.unshift(searchTerm);
    if (globalSearch.recentSearches.length > 10) {
      globalSearch.recentSearches.pop();
    }
    await globalSearch.save();
    console.log('Search term added:', searchTerm);
    return true;
  } catch (error) {
    console.error('Error adding recent search:', error);
    return false;
  }
};

const getRecentSearch = async (key: Record<string, unknown>) => {
  try {
    // Find the global search document (assuming only one document exists)
    const globalSearch = await GlobalSearchModel.findOne();
    if (!globalSearch) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Global search not found');
    }
    // Modify the regular expression to match 'key' anywhere in the term (not just at the beginning)
    const regex = new RegExp(`${key}`, 'i');
    const relatedSearches = globalSearch.recentSearches.filter((term: string) =>
      regex.test(term)
    );
    const limitedResults = relatedSearches.slice(0, 10);
    return limitedResults;
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error fetching recent searches'
    );
  }
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createBusinessmanToDB,
  deleteUser,
  verifyUserPassword,
  addRecentSearch,
  getRecentSearch,
};
