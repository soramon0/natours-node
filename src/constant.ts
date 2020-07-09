import path from 'path';
import dotenv from 'dotenv';
import { ConnectionOptions, QueryFindOneAndUpdateOptions } from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, 'config.env') });

export const IS_DEV = process.env.NODE_ENV === 'development';

export const PORT = process.env.PORT || 5000;

export const DB_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/natours';

export const DEFAULT_QUERY_UPDATE_OPTIONS: QueryFindOneAndUpdateOptions = {
  new: true,
  runValidators: true,
};
