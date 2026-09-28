import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';

import { RouteError } from '@src/common/classes/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Paths from '@src/common/constants/Paths';
import BaseRouter from '@src/routes/apiRouter';

import { EnvVars, NodeEnvs } from './common/constants/environment-consts';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const app = express();

// =============================== Middleware ============================== //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NODE_ENV === NodeEnvs.DEVELOPMENT) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NODE_ENV === NodeEnvs.PRODUCTION) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.$path, BaseRouter);

// Add error handler. `_next` must stay: Express only treats 4-arg middleware
// as an error handler.
app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  if (err instanceof RouteError) {
    return res
      .status(err.status)
      .json({ error: err.message, errors: err.errors });
  }
  if (EnvVars.NODE_ENV !== NodeEnvs.TEST) {
    logger.err(err, true);
  }
  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Internal Server Error' });
});

// =========================== Front-end Content =========================== //

// Views/HTML directory (html)
const viewsDir = path.join(import.meta.dirname, 'views');
const staticDir = path.join(import.meta.dirname, 'public');

// Refresh the browser on changes. Imported lazily because livereload is a
// dev dependency and isn't installed in production.
if (EnvVars.NODE_ENV === NodeEnvs.DEVELOPMENT) {
  const { setupLiveReload } = await import('@src/common/utils/dev-only');
  setupLiveReload(app, [staticDir, viewsDir]);
}

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
