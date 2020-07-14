import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/users';
import AppError from '../lib/AppError';
import { verfiyToken, createAndSendToken } from '../lib/auth';
import { sendEmail } from '../lib/email';

export async function signup(req: Request, res: Response) {
  const user = await User.create(req.body);

  createAndSendToken(user, 201, res);
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, res);
}

export async function isAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  let token = '';

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to gain access.', 401)
    );
  }

  const decoded = await verfiyToken(token);

  // @ts-ignore
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError('The user beloning to this token has been terminated.', 401)
    );
  }

  // @ts-ignore
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! PLease log in again.', 401)
    );
  }

  // @ts-ignore
  req.user = user;

  next();
}

export function restrictTo(...roles: string[]) {
  return (req: Request, _: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );

    next();
  };
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get user
  const user = await User.findOne({ email: req.body.email });
  const message =
    'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.';

  if (!user) {
    return res.json({
      message,
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // generete rest url
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const emailMessage = `You can reset your password using this link: ${resetURL}. If you did not request this reset email, you can ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: emailMessage,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }

  return res.json({
    message,
  });
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // @ts-ignore
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.password = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, res);
}

export async function updatePasword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // @ts-ignore
  const user = await User.findById(req.user.id).select('+password');

  if (
    !user ||
    !(await user.comparePassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
}
