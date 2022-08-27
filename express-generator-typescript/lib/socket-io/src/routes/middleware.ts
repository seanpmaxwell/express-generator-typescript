import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { cookieProps } from '@routes/auth-router';
import jwtUtil from '@util/jwt-util';


// **** Variables **** //

const { UNAUTHORIZED } = StatusCodes;
const jwtNotPresentErr = 'JWT not present in signed cookie.';


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
    if (!!clientData) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
};
