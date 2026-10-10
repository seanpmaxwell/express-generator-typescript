import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import userRouter from './user.router';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// Add more routers as your app grows (e.g. `postsRouter`)
apiRouter.use(Paths.Users.PATH, userRouter);

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
