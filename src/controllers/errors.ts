import { Request, Response, NextFunction } from 'express';
import AppError, * as errorHandlers from '../lib/AppError';

export function catch404(req: Request, _: Response, next: NextFunction) {
  next(
    new AppError(
      `Can't find ${req.originalUrl} endpoint for ${req.method} method`,
      404
    )
  );
}

export function catchAll(
  err: AppError,
  _: Request,
  res: Response,
  __: NextFunction
) {
  let error = {
    name: err.name,
    message: err.message,
    isOperational: err.isOperational,
    statusCode: err.statusCode || 500,
    code: err.code,
  };

  if (error.name === 'CastError') error = errorHandlers.handleDBCastError(err);

  if (error.code === 11000) error = errorHandlers.handleDBDuplicateFields(err);

  if (error.name === 'ValidationError')
    error = errorHandlers.handleDBValidation(err);

  if (error.name === 'JsonWebTokenError')
    error = errorHandlers.handleJWTError(err);

  if (error.name === 'TokenExpiredError')
    error = errorHandlers.handleJWTExpired(err);

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.log(err);

  res.status(500).json({
    message: 'Something went wrong!',
  });
}
