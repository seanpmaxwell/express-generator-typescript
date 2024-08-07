/**
 * Middleware to verify user logged in and is an an admin.
 */

import { NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import { ISessionUser, UserRoles } from '@src/models/User';

import { IReq, IRes } from '../common/types';


// **** Variables **** //

const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';

type TSessionData = ISessionUser & JwtPayload;


/**
 * See note at beginning of file.
 */
async function adminMw(
  req: IReq,
  res: IRes,
  next: NextFunction,
) {
  // Get session data
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
  // Set session data to locals
  if (
    typeof sessionData === 'object' &&
    sessionData?.role === UserRoles.Admin
  ) {
    res.locals.sessionUser = sessionData;
    return next();
  // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: USER_UNAUTHORIZED_ERR });
  }
}


// **** Export Default **** //

export default adminMw;
