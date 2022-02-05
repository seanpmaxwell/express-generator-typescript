import { Router } from 'express';
import { authMw } from './middleware';
import authRouter from './auth';
import userRouter from './users';
import chatRouter from './chat';


// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMw, userRouter);
apiRouter.use('/chat', authMw, chatRouter)

// Export default
export default apiRouter;
