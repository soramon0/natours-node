import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import AppError from '../lib/AppError';

export async function listUsers(_: Request, res: Response) {
  const users = await User.find();

  return res.json({
    total: users.length,
    data: users,
  });
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You can't update your password here.", 401));
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
  };

  // @ts-ignore
  const user = User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  return res.json({
    data: user,
  });
}

export async function deleteMe(req: Request, res: Response) {
  // @ts-ignore
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    data: null,
  });
}
