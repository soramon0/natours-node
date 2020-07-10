import express from 'express';
import morgan from 'morgan';
import { IS_DEV } from './constant';
import { tours, users } from './routes';
import { catchAll, catch404 } from './controllers/errors';

const app = express();

// MIddleware
if (IS_DEV) {
  app.use(morgan('dev'));
}

app.use(express.json());

// Set static files
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);
app.all('*', catch404);
app.use(catchAll);

export default app;
