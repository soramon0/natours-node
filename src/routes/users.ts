import { Router, Request, Response } from 'express';

const router = Router();

router.route('/').get((req: Request, res: Response) => {
  return res.json({
    status: 'success',
  });
});

export default router;
