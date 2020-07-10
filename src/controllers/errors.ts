import { Request, Response, NextFunction } from 'express';
import AppError, {
  handleDBCastError,
  handleDBDuplicateFields,
  handleDBValidation,
} from '../lib/AppError';

export function catch404(req: Request, _: Response, next: NextFunction) {
  next(new AppError(`Can't find ${req.originalUrl} endpoint`, 404));
}

export function catchAll(
  err: AppError,
  _: Request,
  res: Response,
  __: NextFunction
) {
  err.statusCode = err.statusCode || 500;

  let error = {
    name: err.name,
    message: err.message,
    isOperational: err.isOperational,
    statusCode: err.statusCode,
    code: err.code,
  };

  if (error.name === 'CastError') error = handleDBCastError(err);

  if (error.code === 11000) error = handleDBDuplicateFields(err);

  if (error.name === 'ValidationError') error = handleDBValidation(err);

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: 'Something went wrong!',
  });
}
