import HttpStatusCodes from '@configurations/HttpStatusCodes';

import authService from '@services/auth-service';
import EnvVars from '@configurations/EnvVars';
import { IReq, IRes } from '@declarations/types';


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}


// **** Variables **** //

// Paths
const paths = {
  basePath: '/auth',
  login: '/login',
  logout: '/logout',
} as const;


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Get jwt
  const resp = await authService.getJwt(email, password);
  // Check for errors
  if (typeof resp === 'object') {
    return res.status(resp.status).json({ error: resp.msg });
  }
  // Add jwt to the response cookie
  const { key, options } = EnvVars.cookieProps;
  res.cookie(key, resp, options);
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
