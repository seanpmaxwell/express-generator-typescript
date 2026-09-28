import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import UserRoutes from './UserRoutes';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// ============================ Add `userRouter` =========================== //

const userRouter = Router();

userRouter.get(Paths.Users.Get.$path, UserRoutes.getAll);
userRouter.post(Paths.Users.Add.$path, UserRoutes.addOne);
userRouter.put(Paths.Users.Update.$path, UserRoutes.updateOne);
userRouter.delete(Paths.Users.Delete.$path, UserRoutes.deleteOne);

apiRouter.use(Paths.Users.$path, userRouter);

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
