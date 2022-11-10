import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';

import authService from '@src/services/auth-service';
import EnvVars from '@src/declarations/major/EnvVars';
import { IReq, IRes } from './shared/types';


// **** Variables **** //

// Paths
const paths = {
  basePath: '/auth',
  login: '/login',
  logout: '/logout',
} as const;


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Add jwt to cookie
  const jwt = await authService.getJwt(email, password);
  const { key, options } = EnvVars.cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  const { key, options } = EnvVars.cookieProps;
  res.clearCookie(key, options);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  paths,
  login,
  logout,
} as const;
