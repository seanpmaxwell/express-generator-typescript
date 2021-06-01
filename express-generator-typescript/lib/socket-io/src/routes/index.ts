import { Router } from 'express';
import { authMw } from './middleware';
import { login, logout } from './Auth';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { connectSocketRm, emitMessage } from './Chat';


// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);

// User router
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Chat router
const chatRouter = Router();
chatRouter.get('/connect-socket-room/:socketId', connectSocketRm);
chatRouter.post('/emit-message', emitMessage);

// Base router (serves all others)
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', authMw, userRouter);
baseRouter.use('/chat', authMw, chatRouter)
export default baseRouter;
