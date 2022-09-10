import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import BaseRouter from './routes/api';
import logger from 'jet-logger';
import { CustomError } from '@shared/errors';
import envVars from '@shared/env-vars';


// **** Init express **** //

const app = express();


// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(envVars.cookieProps.secret));

// Show routes called in console during development
if (envVars.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Security
if (envVars.nodeEnv === 'production') {
  app.use(helmet());
}


// **** Add API routes **** //

// Add APIs
app.use('/api', BaseRouter);

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | CustomError, req: Request, res: Response, _: NextFunction) => {
  logger.err(err, true);
  const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
  return res.status(status).json({
    error: err.message,
  });
});


// **** Serve front-end content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to login pg by default
app.get('/', (_: Request, res: Response) => {
  res.sendFile('login.html', {root: viewsDir});
});

// Redirect to login if not logged in.
app.get('/users', (req: Request, res: Response) => {
  const jwt = req.signedCookies[envVars.cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('users.html', {root: viewsDir});
  }
});


// **** Export default **** //

export default app;
