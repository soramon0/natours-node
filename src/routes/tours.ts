import { Router } from 'express';
import * as tours from '../controllers/tours';

const router = Router();

router.route('/').get(tours.listTours).post(tours.createTour);

router
  .route('/:id')
  .get(tours.retriveTour)
  .patch(tours.UpdateTour)
  .delete(tours.DestroyTour);

export default router;
