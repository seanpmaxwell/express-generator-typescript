/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@configurations/HttpStatusCodes';
import EnvVars from '@configurations/EnvVars';
import jwtUtil from '@util/jwt-util';
import { IUser, UserRoles } from '@models/User';


// **** Variables **** //

const jwtNotPresentErr = 'JWT not present in signed cookie.';


// **** Types **** //

export interface ISessionUser extends JwtPayload {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}


// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract the token
    const cookieName = EnvVars.cookieProps.key,
      jwt = req.signedCookies[cookieName];
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    const clientData = await jwtUtil.decode<ISessionUser>(jwt);
    if (
      typeof clientData === 'object' &&
      clientData.role === UserRoles.Admin
    ) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  // Catch errors
  } catch (err: unknown) {
    let error;
    if (typeof err === 'string') {
      error = err;
    } else if (err instanceof Error) {
      error = err.message;
    }
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error });
  }
}


// **** Export Default **** //

export default adminMw;
