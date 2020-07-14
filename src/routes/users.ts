import { Router } from 'express';
import * as auth from '../controllers/auth';
import * as users from '../controllers/users';
import { catchAsync } from '../lib/AppError';

const router = Router();

router.post('/signup', catchAsync(auth.signup));
router.post('/signin', catchAsync(auth.signin));
router.patch('/reset-password', catchAsync(auth.forgotPassword));
router.patch('/reset-password/:token', catchAsync(auth.resetPassword));
router.patch(
  '/update-password',
  catchAsync(auth.isAuthenticated),
  catchAsync(auth.updatePasword)
);

router.route('/').get(catchAsync(users.listUsers));
router
  .route('/me')
  .patch(catchAsync(auth.isAuthenticated), catchAsync(users.updateMe))
  .delete(catchAsync(auth.isAuthenticated), catchAsync(users.deleteMe));

export default router;
