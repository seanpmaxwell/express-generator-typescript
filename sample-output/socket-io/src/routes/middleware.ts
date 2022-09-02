import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { cookieProps } from '@routes/auth-router';
import { IUser } from '@models/user-model';
import jwtUtil from '@util/jwt-util';


// **** Variables **** //

const { UNAUTHORIZED } = StatusCodes;
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
 * Middleware to verify if user is an admin.
 */
export async function authMw(req: Request, res: Response, next: NextFunction) {
  try {
    // Get json-web-token
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    const clientData = await jwtUtil.decode(jwt);
    if (!!clientData && typeof clientData !== 'string') {
      res.locals.sessionUser = clientData as ISessionUser;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err) {
    let error;
    if (typeof err === 'string') {
      error = err;
    } else if (err instanceof Error) {
      error = err.message;
    }
    return res.status(UNAUTHORIZED).json({ error });
  }
}
