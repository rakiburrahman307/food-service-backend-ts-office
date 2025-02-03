import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

// Define allowed MIME types dynamically for various file categories
const allowedMimeTypes: { [key: string]: string[] } = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  media: ['video/mp4', 'audio/mpeg'],
  doc: ['application/pdf'],
};

const fileUploadHandler = () => {
  // Create the base upload directory
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Create a directory if it doesn't exist
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(baseUploadDir, file.fieldname);
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // File filtering logic
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    const allowedTypes = allowedMimeTypes[file.fieldname];
    if (!allowedTypes) {
      return cb(new ApiError(StatusCodes.BAD_REQUEST, `Field ${file.fieldname} is not supported`));
    }
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid file type for ${file.fieldname}`));
    }
  };

  // Automatically create multer fields configuration based on allowed MIME types
  const multerFields = Object.keys(allowedMimeTypes).map(fieldname => ({
    name: fieldname,
    maxCount: 3,
  }));

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields(multerFields);

  return upload;
};

export default fileUploadHandler;
