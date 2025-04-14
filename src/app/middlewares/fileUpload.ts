import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
const fileUpload = (uploadDirectory: string) => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req: Request, file, cb) {
      const parts = file.originalname.split('.');
      let extenson;
      if (parts.length > 1) {
        extenson = '.' + parts.pop();
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        parts.shift()!.replace(/\s+/g, '_') + '-' + uniqueSuffix + extenson,
      );
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 15 * 1024 * 1024,
    },

    fileFilter: function (req: Request, file, cb) {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'||
        file.mimetype === 'image/svg' ||
        file.mimetype === 'image/webp'||
        file.mimetype === 'application/octet-stream' ||
        file.mimetype === 'image/svg+xml'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        throw new ApiError(StatusCodes.BAD_REQUEST,'only png,jpg,jpeg,svg format allowed');
      }
    },
  });
  return upload;
};
export default fileUpload;
