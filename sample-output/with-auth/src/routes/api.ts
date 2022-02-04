import { Router } from 'express';
import { adminMW } from './middleware';
import authRouter from './auth';
import userRouter from './users';



// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', adminMW, userRouter);

// Export default
export default apiRouter;
