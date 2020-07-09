import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { DB_OPTIONS, DB_URI } from './constant';
import Tour, { ITour } from './models/tour';

const tours: [ITour] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '..', 'dev-data', 'data', 'tours.json'),
    'utf-8'
  )
);

mongoose.connect(DB_URI, DB_OPTIONS).then(async () => {
  console.log('\t- DB Connected.');
});

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('\t- DB Seeded.');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const EmptyData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('\t- DB Emptyed.');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-e') {
  EmptyData();
} else {
  console.log('\t- Usage: -i for import, -e for empty database.');
  process.exit(1);
}
