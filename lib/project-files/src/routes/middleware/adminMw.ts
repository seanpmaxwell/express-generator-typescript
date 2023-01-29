/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import EnvVars from '@src/constants/EnvVars';

import JwtUtil from '@src/util/JwtUtil';
import { ISessionUser, UserRoles } from '@src/models/User';


// **** Variables **** //

const JWT_NOT_PRESENT_ERR = 'JWT not present in signed cookie.',
  USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';


// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Extract the token
  const { Key } = EnvVars.CookieProps,
    jwt = req.signedCookies[Key];
  if (!jwt) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: JWT_NOT_PRESENT_ERR });
  }
  // Make sure user role is an admin
  const clientData = await JwtUtil.decode<ISessionUser & JwtPayload>(jwt);
  if (
    typeof clientData === 'object' &&
    clientData.role === UserRoles.Admin
  ) {
    res.locals.sessionUser = clientData;
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
