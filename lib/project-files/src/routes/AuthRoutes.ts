import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import AuthService from '@src/services/AuthService';
import EnvVars from '@src/constants/EnvVars';
import { IReq, IRes } from './types/express/misc';



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
  const jwt = await AuthService.getJwt(email, password);
  const { Key, Options } = EnvVars.CookieProps;
  res.cookie(Key, jwt, Options);
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  const { Key, Options } = EnvVars.CookieProps;
  res.clearCookie(Key, Options);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  login,
  logout,
} as const;
