import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import envVars from '@shared/env-vars';
import jwtUtil from '@util/jwt-util';
import { IUser, UserRoles } from '@models/user-model';
import { ParamInvalidError, ValidatorFnError } from '@shared/errors';
import { TAll } from '@shared/types';


// **** Variables **** //

const { UNAUTHORIZED } = StatusCodes;
const jwtNotPresentErr = 'JWT not present in signed cookie.';


// **** Types **** //

type TValidatorFn =  ((arg: TAll) => boolean);
type TParamArr = {
  0: string,
  1?: string | TValidatorFn,
  2?: 'body' | 'query' | 'params',
}

export interface ISessionUser extends JwtPayload {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}


// **** Functions **** //

/**
 * Middleware to verify user logged in and is an an admin.
 */
export async function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract the token
    const cookieName = envVars.cookieProps.key,
      jwt = req.signedCookies[cookieName];
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    const clientData = await jwtUtil.decode<ISessionUser>(jwt);
    if (typeof clientData === 'object' && clientData.role === UserRoles.Admin) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err: unknown) {
    let error;
    if (typeof err === 'string') {
      error = err;
    } else if (err instanceof Error) {
      error = err.message;
    }
    return res.status(UNAUTHORIZED).json({ error });
  }
}

/**
 * This function returns a middleware-function that validates the parameters 
 * provided. Each argument can be a string or array.
 * 
 * If the argument is an array the format is:
 * ['paramName', '(optional) type or validator function (default is string)', 
 * '(optional) property on "req" to extract the value from (default is body')]
 * 
 * If a string, vld makes sure the param is of type string on req.body. For
 * the array, vld makes sure parameter is of the specified type or that the
 * parameter satifies the validator function. The validator function must 
 * return 'true' or 'false'.
 * 
 * **NOTE**: For numbers, strings which evalute to (!isNaN('string') => true)
 * are valid for req.query and req.params. But on req.body a number should be
 * 'typeof toCheck === "number"'
 * 
 * **NOTE**: For booleans, on req.body must be true or false, on req.query or
 * req.params must be 'true' or 'false'.
 * 
 * Sample argument: ['id', 'number'], id is the incoming variable, 'number' 
 * is the type, and body is where to extract 'id' from.
 * 
 * Example 1: validate('email', ['user', 'object'], ['id', 'number', 'params'])
 *  will check that 'email' is a string in req.body, that user is of type 
 *  object in req.body, and that 'id' is a boolean in req.params.
 * Example 2: validate('password') will check that 'password' is a string on
 *  req.body.
 * Example 3: validate(['isAdmin', 'boolean']) will check that 'isAdmin' is a 
 *  boolean on req.body
 * Example 4: validate(['user', isInstanceOfUser]) will check that 'user' 
 *  satifies the 'isInstanceOfUser()' function.
 * Example 5: validate(['email']) will check that 'email' is a string in 
 *  req.body,
 */
export function validate(...params: Array<string | TParamArr>): RequestHandler {
  return (req: Request, _: Response, next: NextFunction) => {
    for (const param of params) {
      // Check params
      if (typeof param !== 'string' && !(param instanceof Array)) {
        throw Error('"validate()" arg must be a string or array');
      }
      // If param is a string, make sure param is of type string on req.body
      if (typeof param === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (typeof req.body[param] !== 'string') {
          throw new ParamInvalidError();
        }
        continue;
      }
      // Get the value to validate from the express Request object.
      const paramName = param[0];
      const reqObjProp = (param.length >= 3 ? param[2] : 'body');
      // Validate request object property
      if (
        reqObjProp !== 'body' &&
        reqObjProp !== 'params' &&
        reqObjProp !== 'query'
      ) {
        throw Error('param[2] must be "body", "query", or "params"');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const toValidate = req[reqObjProp][paramName] as TAll;
      // If type is not present, check it's a string by default
      if (param.length === 1) {
        if (typeof toValidate !== 'string') {
          throw new ParamInvalidError();
        }
      // If a validator function is given, validate it with that
      } else if (typeof param[1] === 'function') {
        const fn = param[1];
        if (!fn(toValidate)) {
          throw new ValidatorFnError(fn.name);
        } else {
          continue;
        }
      // If type is a number, see note above.
      } else if (param[1] === 'number') {
        if (reqObjProp === 'query' || reqObjProp === 'params') {
          if (isNaN(toValidate as number)) {
            throw new ParamInvalidError();
          }
        } else if (reqObjProp === 'body' && typeof toValidate !== 'number') {
          throw new ParamInvalidError();
        }
      // If type is a boolean, see note above.
      } else if (param[1] === 'boolean') {
        if (reqObjProp === 'query' || reqObjProp === 'params') {
          if (!isBool(toValidate as boolean)) {
            throw new ParamInvalidError();
          }
        } else if (reqObjProp === 'body' && typeof toValidate !== 'boolean') {
          throw new ParamInvalidError();
        }
      // Check the param is the provided type
      } else if (typeof toValidate !== param[1]) {
        throw new ParamInvalidError();
      }
    }
    // Call next() if no errors thrown
    next();
  };
}

/**
 * Checks if arg is a boolean, or a string that is 'true', or 'false'.
 */
function isBool(arg: string | boolean): boolean {
  if (typeof arg === 'boolean') {
    return true;
  } else if (typeof arg === 'string') {
    arg = arg.toLowerCase();
    return (arg === 'true' || arg === 'false');
  } else {
    return false;
  }
}
