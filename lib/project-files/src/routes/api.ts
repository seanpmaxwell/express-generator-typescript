import { Router } from 'express';
import { adminMw } from './middleware';

import authRouter, { p as authPaths } from './auth-router';
import userRouter, { p as userPaths } from './user-router';


// Init
const apiRouter = Router();

// Add api routes
apiRouter.use(authPaths.basePath, authRouter);
apiRouter.use(userPaths.basePath, adminMw, userRouter);


// **** Export default **** //

export default apiRouter;
