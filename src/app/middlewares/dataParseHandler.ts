import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const dataParseHandler: RequestHandler = (req, res, next) => {
  try {
    if (req.body.data && typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }
    next();
  } catch (error) {
    // Handle JSON parsing errors
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid JSON data in request body',
    });
  }
};

export default dataParseHandler;
