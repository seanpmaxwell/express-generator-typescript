import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import logger from 'jet-logger';

import express, { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import apiRouter from '@routes/api';
import envVars from '@shared/env-vars';
import { CustomError } from '@shared/errors';


// **** Variables **** //

const app = express();


// **** Set basic express settings ****# //

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (envVars.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (envVars.nodeEnv === 'production') {
  app.use(helmet());
}


// **** Add API Routes ****# //

// Add api router
app.use('/api', apiRouter);

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

// Set views dir
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Serve index.html file
app.get('*', (_: Request, res: Response) => {
  res.sendFile('index.html', {root: viewsDir});
});


// **** Export default **** //

export default app;
