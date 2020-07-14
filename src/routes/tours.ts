import { Router } from 'express';
import * as tours from '../controllers/tours';
import * as auth from '../controllers/auth';
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

router.get(
  '/stats',
  catchAsync(auth.isAuthenticated),
  catchAsync(tours.listStats)
);

router.get('/monthly-plan/:year', catchAsync(tours.retrieveMonthlyPlan));

router
  .route('/:id')
  .get(catchAsync(tours.retrieveTour))
  .patch(catchAsync(tours.updateTour))
  .delete(
    catchAsync(auth.isAuthenticated),
    auth.restrictTo('admin', 'lead-guide'),
    catchAsync(tours.destroyTour)
  );

export default router;
