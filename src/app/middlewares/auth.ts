import { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../enums/user';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../../util/verifyToken';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (roles.includes(USER_ROLES.GUEST) && !tokenWithBearer) {
        req.user = { role: USER_ROLES.GUEST };
        return next();
      }

      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      if (!tokenWithBearer.startsWith('Bearer ')) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Token format is invalid!'
        );
      }

      const token = tokenWithBearer.split(' ')[1];

      let verifyUser: any;
      try {
        verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);
      } catch (error) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      const user = await User.isExistUserById(verifyUser.id);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
      }

      if (user?.status === 'blocked') {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User is blocked!');
      }

      if (user?.isDeleted) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User account is deleted!');
      }

      if (!roles.includes(verifyUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You don't have permission!");
      }

      req.user = verifyUser;
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
