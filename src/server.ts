process.on('uncaughtException', (err: any) => {
  console.log(`\t- Server encountered a exception ${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

import app from './app';
import mongoose from 'mongoose';
import { PORT, DB_URI, DB_OPTIONS } from './constant';

mongoose.connect(DB_URI, DB_OPTIONS).then(() => {
  console.log('\t- DB Connected.');
});

const server = app.listen(PORT, () => {
  console.log(`\t- Server Listening on ${PORT}.`);
});

process.on('unhandledRejection', (err: any) => {
  console.log(`\t- Server encountered a rejection ${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
