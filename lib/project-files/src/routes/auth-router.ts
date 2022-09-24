import { Router } from 'express';
import StatusCodes from 'http-status-codes';

import authService from '@services/auth-service';
import envVars from 'src/shared/env-vars';
import { IReq, IRes } from '@shared/types';
import { vld } from './middleware';


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}


// **** Variables **** //

// Status codes
const { OK } = StatusCodes;

// Paths
export const p = {
  basePath: '/auth',
  login: '/login',
  logout: '/logout',
} as const;


// **** Setup Router **** //

const router = Router();
router.post(p.login, vld('email', 'password'), login);
router.get(p.logout, logout);


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Add jwt to cookie
  const jwt = await authService.getJwt(email, password);
  const { key, options } = envVars.cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  const { key, options } = envVars.cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).end();
}


// **** Export router **** //

export default router;
