import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

const uploadFileHandler = () => {
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(baseUploadDir, file.fieldname);
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName = file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') + '-' + Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
  }).any(); // Allow dynamic field names

  return (req: Request, res: any, next: any) => {
    upload(req, res, (err: any) => {
      if (err) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, err.message || 'Upload failed')
        );
      }
      next();
    });
  };
};

export default uploadFileHandler;
