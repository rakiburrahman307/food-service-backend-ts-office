import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../app/modules/user/user.model';
import config from '.';
import { USER_ROLES } from '../enums/user';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.social.google_client_id as string,
      clientSecret: config.social.google_client_secret as string,
      callbackURL: `${config.social.callback_url}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile)
          return done(
            new ApiError(StatusCodes.NOT_FOUND, 'Google profile not found'),
            undefined
          );

        const { id, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value || '';
        const picture = photos?.[0]?.value || '';
        let user: any = await User.findOne({ email });
        if (user) {
          if (!user.appId) {
            user.appId = id;
            user.image = picture;
            await user.save();
          }
        } else {
          // If the user does not exist, create a new user
          user = await User.create({
            appId: id,
            name: displayName,
            email,
            image: picture,
            verified: true,
            role: USER_ROLES.USER,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.social.facebook_client_id as string,
      clientSecret: config.social.facebook_client_secret as string,
      callbackURL: `${config.social.callback_url}/api/v1/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile)
          return done(new Error('Google profile not found'), undefined);

        const { id, displayName, emails, photos }: any = profile;
        const email = emails?.[0]?.value || '';
        const picture = photos?.[0]?.value || '';

        let user: any = await User.findOne({ email });
        console.log(picture);
        if (user) {
          if (!user.appId) {
            user.appId = id;
            user.image = picture;
            await user.save();
          }
        } else {
          // If the user does not exist, create a new user
          user = await User.create({
            appId: id,
            name: displayName,
            email,
            image: picture,
            role: USER_ROLES.USER,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
// Serialize & Deserialize User
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const user = await User.findById(id);
    done(null, id as any);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
