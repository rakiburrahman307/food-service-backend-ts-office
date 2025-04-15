import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import passport from './config/passport';
import session from 'express-session';
import config from './config';
import { startCheckOfferJob } from './app/modules/offer/offerExpireCheak';
import { welcome } from './util/welcome';
import { updateShopsWithTopCategories } from './helpers/updateCategory';
const app: Application = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
  cors({
    origin: [
      'http://139.59.0.25:5173',
      'http://139.59.0.25:5174',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://ubuntu-business-dashboard.netlify.app',
      'https://ubuntu-admin-dashboard.netlify.app',
      'https://api.foodsavr.com',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));
app.use(express.static('public'));

// Session middleware (must be before passport initialization)
app.use(
  session({
    secret: config.express_sessoin as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Secure should be true in production with HTTPS
  })
);
// updateShopsWithTopCategories();
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//router
app.use('/api/v1', router);
startCheckOfferJob();
//live response
app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  res.send(welcome());
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
