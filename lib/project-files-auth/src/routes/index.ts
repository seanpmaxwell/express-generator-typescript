import { Router } from 'express';

import Paths from '@src/common/Paths';

import adminMw from './middleware/adminMw';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';


// **** Variables **** //

const apiRouter = Router();


// **** AuthRouter **** //

const authRouter = Router();

// Routes
authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.get(Paths.Auth.Logout, AuthRoutes.logout);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);


// **** UserRouter **** //

const userRouter = Router();

// User Routes
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// Add UserRouter
apiRouter.use(Paths.Users.Base, adminMw, userRouter);


// **** Export default **** //

export default apiRouter;
