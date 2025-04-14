import { IHelpContact } from '../app/modules/contactUs/contact.interface';
import { IPaymentData } from '../app/modules/payment/payment.interface';
import {
  ICreateAccount,
  IResetPassword,
  IResetPasswordByEmail,
} from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
        <img src="https://res.cloudinary.com/dd1l2c2kb/image/upload/v1740378025/ifnlyaniaxfgszcj5caz.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Otp</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/dd1l2c2kb/image/upload/v1740378025/ifnlyaniaxfgszcj5caz.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};
const resetPasswordByUrl = (values: IResetPasswordByEmail) => {
  const data = {
    to: values.email,
    subject: 'Reset Your Password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/dd1l2c2kb/image/upload/v1740378025/ifnlyaniaxfgszcj5caz.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${values.resetUrl}" target="_blank" style="display: inline-block; background-color: #277E16; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 18px; margin: 20px auto;">Reset Password</a>
          <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">If you didn’t request this, you can ignore this email.</p>
          <p style="color: #b9b4b4; font-size: 14px;">This link will expire in 10 minutes.</p>
        </div>
      </div>
    </body>`,
  };
  return data;
};

const contactFormTemplate = (values: IHelpContact) => {
  const data = {
    to: values.email,
    subject: 'Thank you for reaching out to us',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/dd1l2c2kb/image/upload/v1740378025/ifnlyaniaxfgszcj5caz.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello ${values.name},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for reaching out to us. We have received your message:</p>
            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 20px;">
                <p style="color: #555; font-size: 16px; line-height: 1.5;">"${values.message}"</p>
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We will get back to you as soon as possible. Below are the details you provided:</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Email: ${values.email}</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Phone: ${values.phone}</p>
            <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">If you need immediate assistance, please feel free to contact us directly at our support number.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};
const paymentConfirmationTemplate = (values: IPaymentData) => {
  const data = {
    to: values.email,
    subject: 'Payment Confirmation - Your Order is Successful!',
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <div style="width: 100%; background-color: #f9f9f9; padding: 20px 0;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="padding: 20px;">
            <img src="https://res.cloudinary.com/dd1l2c2kb/image/upload/v1740378025/ifnlyaniaxfgszcj5caz.png" alt="Logo" style="display: block; margin: 0 auto 20px; width: 150px;" />
            <div style="text-align: center;">
              <h2 style="color: #2d89ef; font-size: 24px;">Payment Confirmation</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.5;">Hello ${
                values.name
              },</p>
              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for your payment! Your transaction has been successfully processed.</p>

              <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 20px; text-align: left;">
                <h3 style="color: #333; margin-bottom: 10px;">Payment Details:</h3>
                <p><strong>Order Number:</strong> ${values.orderNumber}</p>
                <p><strong>Transaction ID:</strong> ${values.transactionId}</p>
                <p><strong>Amount Paid:</strong> ${
                  values.amount
                } ${values.currency.toUpperCase()}</p>
                <p><strong>Payment Method:</strong> ${values.paymentMethod}</p>
                <p><strong>Date:</strong> ${new Date(
                  values.date
                ).toLocaleDateString()}</p>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>

              <p style="color: #888; font-size: 14px; line-height: 1.5;">Thank you for choosing us!</p>
              <p style="color: #888; font-size: 14px; line-height: 1.5;">Best Regards, <br> <strong>UBUNTU BITES</strong></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Responsive Styles -->
      <style>
        @media only screen and (max-width: 600px) {
          body, table, td, a {
            -webkit-text-size-adjust: 100% !important;
            -ms-text-size-adjust: 100% !important;
          }
          table {
            width: 100% !important;
          }
          .mobile-padding {
            padding: 10px !important;
          }
          .mobile-center {
            text-align: center !important;
          }
        }
      </style>
    </body>
    `,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  resetPasswordByUrl,
  contactFormTemplate,
  paymentConfirmationTemplate,
};
