import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import authService from '@services/auth-service';
import envVars from '@shared/env-vars';
import { ParamMissingError } from '@shared/errors';
import { IReq } from 'src/types/express';


// **** Variables **** //

// Misc
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
  login: '/login',
  logout: '/logout',
} as const;


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}


// **** Routes **** //

/**
 * Login a user.
 */
router.post(p.login, async (req: IReq<ILoginReq>, res: Response) => {
  // Check email and password present
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new ParamMissingError();
  }
  // Get jwt
  const jwt = await authService.login(email, password);
  // Add jwt to cookie
  const { key, options } = envVars.cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(OK).end();
});

/**
 * Logout the user.
 */
router.get(p.logout, (_: Request, res: Response) => {
  const { key, options } = envVars.cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).end();
});


// **** Export router **** //

export default router;
