import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(
  __dirname,
  '..',
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const tours = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const router = Router();

router.route('/').get((req: Request, res: Response) => {
  return res.json({
    status: 'success',
    count: tours.length,
    tours,
  });
});

export default router;
