import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import UserRoutes from './UserRoutes';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// ============================ Add `userRouter` =========================== //

const userRouter = Router();

userRouter.get(Paths.Users.Get._, UserRoutes.getAll);
userRouter.post(Paths.Users.Add._, UserRoutes.add);
userRouter.put(Paths.Users.Update._, UserRoutes.update);
userRouter.delete(Paths.Users.Delete._, UserRoutes.delete);

apiRouter.use(Paths.Users._, userRouter);

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
