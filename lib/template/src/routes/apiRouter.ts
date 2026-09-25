import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import UserRoutes from './UserRoutes';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// ============================ Add `userRouter` =========================== //

const userRouter = Router();

userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

apiRouter.use(Paths.Users._, userRouter);

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
