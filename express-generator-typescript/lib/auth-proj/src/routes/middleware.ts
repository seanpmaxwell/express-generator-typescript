import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { UserRoles } from '@models/user-model';
import envVars from 'src/shared/env-vars';
import jwtUtil from '@util/jwt-util';


// **** Variables **** //

const { UNAUTHORIZED } = StatusCodes;
const jwtNotPresentErr = 'JWT not present in signed cookie.';


// **** Functions **** //

/**
 * Middleware to verify if user is an admin.
 */
export async function adminMw(req: Request, res: Response, next: NextFunction) {
  try {
    // Get json-web-token
    const jwt = req.signedCookies[envVars.cookieProps.key];
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    const clientData = await jwtUtil.decode(jwt);
    if (typeof clientData === 'object' && clientData.role === UserRoles.Admin) {
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
