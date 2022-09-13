import { Router } from 'express';
import StatusCodes from 'http-status-codes';

import authService from '@services/auth-service';
import envVars from 'src/shared/env-vars';
import { IReq, IRes } from '@shared/types';
import validate from './validators';


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}


// **** Variables **** //

const router = Router();

// Status codes
const { OK } = StatusCodes;

// Paths
export const p = {
  basePath: '/auth',
  login: '/login',
  logout: '/logout',
} as const;


// **** Routes **** //

/**
 * Login a user.
 */
router.post(p.login, async (req: IReq<ILoginReq>, res: IRes) => {
  const { email, password } = req.body;
  validate(email, password);
  // Add jwt to cookie
  const jwt = await authService.login(email, password);
  const { key, options } = envVars.cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(OK).end();
});

/**
 * Logout the user.
 */
router.get(p.logout, (_: IReq, res: IRes) => {
  const { key, options } = envVars.cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).end();
});


// **** Export router **** //

export default router;
