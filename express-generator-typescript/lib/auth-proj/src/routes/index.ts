import { Router } from 'express';
import { adminMW } from './middleware';
import { login, logout } from './Auth';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';


// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);


// User-router
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', adminMW, userRouter);
export default baseRouter;
