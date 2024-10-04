import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq, res: IRes) {
  const [ email, password ] = check.isStr(req.body, ['email', 'password']),
    user = await AuthService.login(email, password);
  // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  });
  // Return
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  login,
  logout,
} as const;
