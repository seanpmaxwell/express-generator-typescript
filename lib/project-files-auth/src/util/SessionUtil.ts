import jsonwebtoken from 'jsonwebtoken';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import EnvVars from '@src/common/EnvVars';
import { IReq, IRes } from '@src/routes/common/types';


// **** Variables **** //

// Errors
const Errors = {
  ParamFalsey: 'Param is falsey',
  Validation: 'JSON-web-token validation failed.',
} as const;

// Options
const Options = {
  expiresIn: EnvVars.Jwt.Exp,
};


// **** Functions **** //

/**
 * Get session data from request object (i.e. ISessionUser)
 */
function getSessionData<T>(req: IReq): Promise<string | T | undefined> {
  const { Key } = EnvVars.CookieProps,
    jwt = req.signedCookies[Key];
  return _decode(jwt);
}

/**
 * Decrypt JWT and extract client data.
 */
function _decode<T>(jwt: string): Promise<string | undefined | T> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, EnvVars.Jwt.Secret, (err, decoded) => {
      if (!!err) {
        const err = new RouteError(HttpStatusCodes.UNAUTHORIZED, 
          Errors.Validation);
        return rej(err);
      } else {
        return res(decoded as T);
      }
    });
  });
}

/**
 * Add a JWT to the response 
 */
async function addSessionData(
  res: IRes,
  data: string | object,
): Promise<IRes> {
  if (!res || !data) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.ParamFalsey);
  }
  // Setup JWT
  const jwt = await _sign(data),
    { Key, Options } = EnvVars.CookieProps;
  // Return
  return res.cookie(Key, jwt, Options);
}

/**
 * Encrypt data and return jwt.
 */
function _sign(data: string | object | Buffer): Promise<string> {
  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, EnvVars.Jwt.Secret, Options, (err, token) => {
      return (err ? rej(err) : res(token ?? ''));
    });
  });
}

/**
 * Remove cookie
 */
function clearCookie(res: IRes): IRes {
  const { Key, Options } = EnvVars.CookieProps;
  return res.clearCookie(Key, Options);
}


// **** Export default **** //

export default {
  addSessionData,
  getSessionData,
  clearCookie,
} as const;
