import { Router } from 'express';
import * as tours from '../controllers/tours';

const router = Router();

router.get('/top-5-cheap', tours.topTours, tours.listTours);

router.route('/').get(tours.listTours).post(tours.createTour);

router
  .route('/:id')
  .get(tours.retriveTour)
  .patch(tours.updateTour)
  .delete(tours.destroyTour);

export default router;
