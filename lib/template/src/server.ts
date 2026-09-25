import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import { RouteError } from '@src/common/utils/route-errors';
import BaseRouter from '@src/routes/apiRouter';

import EnvVars, { NodeEnvs } from './common/constants/env';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const app = express();

// =============================== Middleware ============================== //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths._, BaseRouter);

// Add error handler. `_next` must stay: Express only treats 4-arg middleware
// as an error handler.
app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  if (err instanceof RouteError) {
    return res
      .status(err.status)
      .json({ error: err.message, errors: err.errors });
  }
  if (EnvVars.NodeEnv !== NodeEnvs.TEST) {
    logger.err(err, true);
  }
  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Internal Server Error' });
});

// =========================== Front-end Content =========================== //

// Views directory (html)
const viewsDir = path.join(__dirname, 'views');

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

// Users page
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default app;
