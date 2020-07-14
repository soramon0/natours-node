import { NextFunction, Response, Request } from 'express';

export default class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code = 0;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function catchAsync(fn: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function handleDBCastError(err: any): AppError {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

export function handleDBDuplicateFields(_: any): AppError {
  const message = `Duplicate field value: x. Please use another value!`;
  return new AppError(message, 400);
}

export function handleDBValidation(err: any): AppError {
  const errors = Object.values(err.errors).map((error: any) => error.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

export function handleJWTError(_: any): AppError {
  const message = 'Invalid token. Please log in again!';
  return new AppError(message, 401);
}

export function handleJWTExpired(_: any): AppError {
  const message = 'Token Expired. Please log in again!';
  return new AppError(message, 401);
}
