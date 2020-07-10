import { Router } from 'express';
import * as tours from '../controllers/tours';
import { catchAsync } from '../lib/AppError';

const router = Router();

router
  .route('/')
  .get(catchAsync(tours.listTours))
  .post(catchAsync(tours.createTour));

router.get(
  '/top-5-cheap',
  catchAsync(tours.topTours),
  catchAsync(tours.listTours)
);

router.get('/stats', catchAsync(tours.listStats));

router.get('/monthly-plan/:year', catchAsync(tours.retrieveMonthlyPlan));

router
  .route('/:id')
  .get(catchAsync(tours.retrieveTour))
  .patch(catchAsync(tours.updateTour))
  .delete(catchAsync(tours.destroyTour));

export default router;
