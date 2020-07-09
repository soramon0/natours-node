import { Router } from 'express';
import * as tours from '../controllers/tours';

const router = Router();

router.route('/').get(tours.listTours).post(tours.createTour);

router.get('/top-5-cheap', tours.topTours, tours.listTours);

router.get('/stats', tours.listStats);

router.get('/monthly-plan/:year', tours.retrieveMonthlyPlan);

router
  .route('/:id')
  .get(tours.retrieveTour)
  .patch(tours.updateTour)
  .delete(tours.destroyTour);

export default router;
