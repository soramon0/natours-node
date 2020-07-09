import app from './app';
import mongoose from 'mongoose';
import { PORT, DB_URI, DB_OPTIONS } from './constant';

mongoose.connect(DB_URI, DB_OPTIONS).then(() => {
  console.log('\t- DB Connected.');
});

const server = app.listen(PORT, () => {
  console.log(`\t- Server Listening on ${PORT}.`);
});

server.on('error', (err) => {
  console.log(`\t- Server encountered a ${err.name}: ${err.message}`);
  process.exit();
});
