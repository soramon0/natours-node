import { model, Schema, Document, Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export enum UserRoles {
  user,
  guide,
  'lead-guide',
  admin,
}

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  role: UserRoles;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  active: boolean;
  comparePassword(candidate: string, current: string): Promise<boolean>;
  changedPasswordAfter(JWTIat: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator(el: string): boolean {
        //   @ts-ignore
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const hashedPassword = await bcrypt.hash(this.get('password'), 12);
  this.set('password', hashedPassword);

  this.set('passwordConfirm', undefined);

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) next();

  this.set('passwordChangedAt', Date.now() - 1000);

  next();
});

userSchema.pre<Query<IUser>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async (
  candidate: string,
  current: string
): Promise<boolean> => await bcrypt.compare(candidate, current);

userSchema.methods.changedPasswordAfter = function (JWTIat: number): boolean {
  const passwordChangedAt: Date = this.get('passwordChangedAt');

  if (passwordChangedAt) {
    const changedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);

    return JWTIat < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.set('passwordResetToken', hash);
  this.set('passwordResetExpires', Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export default model<IUser>('User', userSchema);
