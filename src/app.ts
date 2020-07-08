import express from 'express';
import morgan from 'morgan';
import { tours, users } from './routes';

const app = express();

// MIddleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);

export default app;