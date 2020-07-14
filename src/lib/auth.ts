import jwt from 'jsonwebtoken';
import { IUser } from '../models/users';
import { Response } from 'express';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const algorithm = 'HS512';

export function signToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET!, {
    algorithm,
    expiresIn: JWT_EXPIRES_IN || '90d',
  });
}

export async function verfiyToken(token: string): Promise<object | null> {
  return new Promise((resolve, reject) =>
    jwt.verify(token, JWT_SECRET!, (err, decoded) => {
      if (err) return reject(err);

      resolve(decoded);
    })
  );
}

export function createAndSendToken(
  user: IUser,
  statusCode: number,
  res: Response
) {
  const token = signToken(user.id);

  return res.status(statusCode).json({
    token,
    data: user,
  });
}
