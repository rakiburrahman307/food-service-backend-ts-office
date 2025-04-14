import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import passport from '../../../config/passport';
import { User } from '../user/user.model';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPassword
);

router.post(
  '/verify-email',
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.verifyEmail
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPassword
);
router.post(
  '/dashboard/forget-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPasswordByUrl
);

router.post(
  '/dashboard/reset-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESSMAN),
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPasswordByUrl
);

router.post(
  '/change-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.BUSINESSMAN),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.changePassword
);
router.post('/resend-otp', AuthController.resendOtp);

// Google Auth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'business=false',
  })
);
router.get(
  '/google/business',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'business=true',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    const { _id, role, email }: any = req.user;
    const isBusiness = req.query.state === 'business=true';
    const assignedRole = isBusiness ? USER_ROLES.BUSINESSMAN : USER_ROLES.USER;
    // Update user role in the database if necessary
    const result = await User.findByIdAndUpdate(_id, { role: assignedRole });
    const createToken = jwtHelper.createToken(
      { _id, role, email },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expire_in as string
    );
    res.redirect(`/?token=${createToken}`);
  }
);

// Facebook Auth Routes
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const { _id, role, email }: any = req.user;
    const createToken = jwtHelper.createToken(
      { _id, role, email },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expire_in as string
    );
    res.redirect(`/?token=${createToken}`);
  }
);

export const AuthRoutes = router;
